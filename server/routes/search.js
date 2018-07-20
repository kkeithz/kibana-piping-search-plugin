import moment from 'moment';
import csv from 'fast-csv';

const customApiPlugin = Client =>
  class CustomClient extends Client {
    pipingSearch(param) {
      return this.transport.request({
        method: 'POST',
        path: '/_piping_search',
        body: {
          query: param.query,
          date_range: param.date_range,
        },
      });
    }
  }

export default function (server) {
  const config = server.config().get('elasticsearch');
  config.plugins = [customApiPlugin];
  const cluster = server.plugins.elasticsearch.createCluster('pipingSearch', config);
  
  //create index
  cluster.getClient().create({
    index: '.piping-search',
    type: '_doc',
    id: '1',
    body: {
      name: 'index created',
    }
  }).then((resp)=>{
  }).catch((err)=>{
    //expected error as already created
  });

  //search
  server.route({
    path: '/api/piping-search-plugin/search',
    method: 'POST',
    handler(req, reply) {
      cluster.callWithRequest(req,'pipingSearch',req.payload)
      .then((resp =>{
        reply(resp);
      })).catch(err => {
        console.log(err);
        reply({
          query: req.payload.query,
          err: err,
        })
      });
    }
  });
  //lookup
  server.route({
    path: '/api/piping-search-plugin/lookup/{name}',
    method: 'PUT',
    handler(req, reply) {
      var name = req.params.name;
      var csvData = req.payload.data;

      var isHandled = false;
      var bulkData = [];
      var columns = null;
      var count = 0;
      csv.fromString(csvData, {headers: true})
      .on('data', (data)=>{
        if(columns == null){
          columns = [];
          for(var key in data){
            columns.push(key);
          }
        }
        count++;
        data._sourcetype = '_lookup_data';
        data._name = name;
        bulkData.push({ index: { _index: '.piping-search', _type: '_doc' } });
        bulkData.push(data);
      })
      .on('end', ()=>{
        bulkData.push({ index: { _index: '.piping-search', _type: '_doc' } });
        bulkData.push({ _sourcetype: '_lookup', name: name, columns: columns.join(','), count: count, upload_date: moment().toJSON() });

        //create
        cluster.getClient().deleteByQuery({
          index: '.piping-search',
          q: `_sourcetype:_lookup AND name:${name}`,
          refresh: true,
        }).then((resp)=>{
          return cluster.getClient().deleteByQuery({
            index: '.piping-search',
            q: `_sourcetype:_lookup_data AND _name:${name}`,
            refresh: true,
          });
        }).then((resp)=>{
          return cluster.getClient().bulk({
            body: bulkData,
            refresh: true,
          });
        }).then((resp)=>{
          reply({
            result: true,
          });
        }).catch((err)=>{
          reply({
            result: false,
            err: err,
          });
        });
      })
      .on('error', (err)=>{
        if(!isHandled){
          isHandled = true;
          reply({
            result: false,
            err: err,
          });
        }
      });
    }
  });
  server.route({
    path: '/api/piping-search-plugin/lookup',
    method: 'GET',
    handler(req, reply) {
      cluster.getClient().search({
        index: '.piping-search',
        q: '_sourcetype:_lookup',
      }).then((resp)=>{
        var lookupList = [];
        for(var i=0; i<resp.hits.hits.length; i++){
          lookupList.push(resp.hits.hits[i]._source);
        }
        reply({
          results: lookupList,
        });
      }).catch((err)=>{
        console.log(err);
        reply({
          results: [],
        });
      });
    }
  });
  server.route({
    path: '/api/piping-search-plugin/lookup/{name}',
    method: 'GET',
    handler(req, reply) {
      cluster.getClient().search({
        index: '.piping-search',
        q: `_sourcetype:_lookup_data AND _name:${req.params.name}`,
      }).then((resp)=>{
        var lookupList = [];
        for(var i=0; i<resp.hits.hits.length; i++){
          delete resp.hits.hits[i]._source._sourcetype;
          delete resp.hits.hits[i]._source._name;
          lookupList.push(resp.hits.hits[i]._source);
        }
        reply({
          results: lookupList,
        });
      }).catch((err)=>{
        console.log(err);
        reply({
          results: [],
        });
      });
    }
  });
  server.route({
    path: '/api/piping-search-plugin/lookup/{name}',
    method: 'DELETE',
    handler(req, reply) {
      cluster.getClient().deleteByQuery({
        index: '.piping-search',
        q: `_sourcetype:_lookup AND name:${req.params.name}`,
        refresh: true,
      }).then((resp)=>{
        return cluster.getClient().deleteByQuery({
          index: '.piping-search',
          q: `_sourcetype:_lookup_data AND _name:${req.params.name}`,
          refresh: true,
        });
      }).then((resp)=>{
        reply({
          result: true,
        });
      });
    }
  });
  

}
