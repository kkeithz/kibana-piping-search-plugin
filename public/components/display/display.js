import React from "react";
import { Table } from "./table";
import { BarChart } from "./barchart";
import { LineChart } from "./linechart";
import { PieChart } from "./piechart";

export class Display extends React.Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps, nextState){
    return (nextProps.data != this.props.data) ||
    (nextProps.chartType != this.props.chartType);
  }
  render() {
    return (
      <div style={{width:'100%',height:'100%'}}>
        {this.props.chartType == "Table" && (<Table data={this.props.data} />)}
        {this.props.chartType == "Bar Chart" && (<BarChart data={this.props.data} />)}
        {this.props.chartType == "Line Chart" && (<LineChart data={this.props.data} />)}
        {this.props.chartType == "Pie Chart" && (<PieChart data={this.props.data} />)}
      </div>
    );
  }
  
};
