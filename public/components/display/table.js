import React from "react";
import {
  EuiBasicTable
} from "@elastic/eui";

export class Table extends React.Component {
  constructor(props) {
    super(props);
    var fullData = props.data;
    if(fullData == null) fullData = [];
    var displayData = this.filterData(fullData, null, 0, 25);
    this.state = {
      fullData: fullData,
      displayData: displayData,
      sort: {
        field: "",
        direction: "asc",
      },
      page: 0,
      limit: props.limit?props.limit:25,
    };
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.data != this.state.fullData){
      this.setData(nextProps.data);
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    return (nextState.displayData != this.state.displayData)
           || (nextState.sort != this.state.sort)
           || (nextState.page != this.state.page);
  }
  setData(data){
    if(data != this.state.fullData){
      this.setState({
        fullData: data,
        displayData: this.filterData(data, null, 0, this.state.limit),
        sort: {
          field: "",
          direction: "asc",
        },
        page: 0
      });
    }
  }
  filterData(data, sort, page, limit){
    if(data != null){
      if(sort != null && sort.field != ""){
        data.sort((a,b)=>{
          var direction = sort.direction == 'desc'?-1:1;
          if(a[sort.field] < b[sort.field]){
            return -1*direction;
          }
          if(a[sort.field] > b[sort.field]){
            return 1*direction;
          }
          return 0;
        });
      }
      return data.slice(page*limit, (page+1)*limit);
    }
    return [];
  }
  onTableChange(e){
    this.setState({
      sort: e.sort,
      page: e.page.index,
      limit: e.page.size,
      displayData: this.filterData(this.state.fullData, e.sort, e.page.index, e.page.size),
    });
  }
  getItem(){
    return this.state.displayData;
  }
  getColumns(){
    if(this.props.columns != null){
      return this.props.columns;
    }else{
      var data = this.state.fullData;
      var columns = [];
      if(data != null && data.length > 0){
        for(var key in data[0]){
          columns.push({
            field: key,
            name: key,
            sortable: true,
            hideForMobile: false,
          });
        }
      }
      return columns;
    }
  }
  render() {
    return (
      <div>
        <EuiBasicTable
          items={this.getItem()}
          columns={this.getColumns()}
          sorting={{
            sort:this.state.sort
          }}
          pagination={{
            pageIndex: this.state.page,
            pageSize: this.state.limit,
            totalItemCount: this.state.fullData.length,
          }}
          onChange={this.onTableChange.bind(this)}
        />
      </div>
    );
  }
  
};
