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
  const cluster = server.plugins.elasticsearch.createCluster('asearch', config);
  
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

}
