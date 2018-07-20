let instance = null;
export default class Service{
  constructor() {
    if(!instance){
      instance = this;
    }
    return instance;
  }
  static getInstance(){
    if(!instance){
      instance = new Service();
    }
    return instance;
  }
  setHttp(httpClient){
    this.httpClient = httpClient;
  }

  search(data){
    return this.httpClient.post("../api/piping-search-plugin/search", data)
    .then((resp) => {
      if(resp.status == 200 && 
        resp.data.results != null
      ){
        return resp.data;
      }else{
        console.log(resp);
        if(resp.data.err != null){
          throw resp.data.err.msg;
        }else{
          throw "Server Error";
        }
      }
    });
  }
  lookup(){
    return this.httpClient.get("../api/piping-search-plugin/lookup")
    .then((resp) => {
      if(resp.status == 200 && 
        resp.data.results != null
      ){
        return resp.data;
      }else{
        console.log(resp);
        if(resp.data.err != null){
          throw resp.data.err.msg;
        }else{
          throw "Server Error";
        }
      }
    });
  }
  lookupData(lookup){
    return this.httpClient.get("../api/piping-search-plugin/lookup/"+lookup)
    .then((resp) => {
      if(resp.status == 200 && 
        resp.data.results != null
      ){
        return resp.data;
      }else{
        console.log(resp);
        if(resp.data.err != null){
          throw resp.data.err.msg;
        }else{
          throw "Server Error";
        }
      }
    });
  }
  createLookup(lookup, csvData){
    return this.httpClient.put("../api/piping-search-plugin/lookup/"+lookup,
      {
        data: csvData
      }
    ).then((resp) => {
      if(resp.status == 200 && resp.data.result){
        return resp.data.result;
      }else{
        console.log(resp);
        throw "Server Error";
      }
    });
  }
  deleteLookup(lookup){
    return this.httpClient.delete("../api/piping-search-plugin/lookup/"+lookup)
    .then((resp) => {
      if(resp.status == 200 && resp.data.result){
        return resp.data.result;
      }else{
        console.log(resp);
        throw "Server Error";
      }
    });
  }
};