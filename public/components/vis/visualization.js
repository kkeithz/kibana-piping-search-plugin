import React from "react";
import { Display } from "../display/display"

export class Visualization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.visData != this.props.visData){
      return true;
    }
    this.props.renderComplete();
    return false;
  }
  componentDidMount() {
    this.props.renderComplete();
  }
  componentDidUpdate() {
    this.props.renderComplete();
  }
  render() {
    return (
      <Display data={this.props.visData.results} chartType={this.props.vis.params.chartType} />
    );
  }
};
