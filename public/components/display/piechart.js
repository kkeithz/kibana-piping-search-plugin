import React from "react";
import Chart from "chart.js";
import { Colors } from "./color/colors";

Chart.defaults.global.animation.duration = 0;

export class PieChart extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps(nextProps){
  }
  shouldComponentUpdate(nextProps, nextState){
    return true;
  }
  componentDidMount() {
    this.update();
  }
  componentWillUnmount(){
  }
  componentDidUpdate(){
    this.update();
  }
  getLabelColumn(){
    if(this.props.data != null && this.props.data.length > 0){
      for(var key in this.props.data[0]){
        return key;
      }
    }
    return null;
  }
  getDataColumns(){
    var dataColumns = [];
    if(this.props.data != null && this.props.data.length > 0){
      for(var key in this.props.data[0]){
        if(typeof this.props.data[0][key] === "number"){
          dataColumns.push(key);
        }
      }
    }
    return dataColumns;
  }
  getData(column){
    var data = [];
    if(this.props.data != null && this.props.data.length > 0){
      for(var i=0; i<this.props.data.length; i++){
        data.push(this.props.data[i][column]);
      }
    }
    return data;
  }
  getLabels(){
    var labelColumn = this.getLabelColumn();
    return this.getData(labelColumn);
  }
  getDataSets(){
    var datasets = [];
    var dataColumns = this.getDataColumns();
    for(var i=0; i<dataColumns.length; i++){
      var column = dataColumns[i];
      datasets.push({
        label: column,
        data: this.getData(column),
        backgroundColor: Colors.getColor(i),
      });
    }
    return datasets;
  }
  update(){
    if(this._chart == null){
      this._chart = new Chart(this.refs.chart, {
        type: 'pie',
        data: {
          labels: this.getLabels(),
          datasets: this.getDataSets(),
        },
        options: {
            maintainAspectRatio: false,
            legend: {
              position: "right",
              fullWidth: false,
              display: false,
            },
        }
      });
    }else{
      this._chart.data.labels = this.getLabels();
      this._chart.data.datasets = this.getDataSets();
      this._chart.update();
    }
  }
  render() {
    return (
      <div style={{width:'100%',height:'100%'}}>
        <canvas ref="chart"></canvas>
      </div>
    );
  }
  
};
