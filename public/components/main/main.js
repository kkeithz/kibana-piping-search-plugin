import React from "react";
import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFieldSearch,
  EuiButtonIcon,
  EuiSelect
} from "@elastic/eui";
import { TimeFilter } from './timefilter';
import { Display } from "../display/display";

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      data: [],
      chartType: "Table",
    };
  }

  componentDidMount() {
  }
  search(){
    const { httpClient } = this.props;
    httpClient.post("../api/piping-search-plugin/search", {
      query: this.state.query,
      date_range: {
        field: "@timestamp",
        from: this.refs.timefilter.state.startDate,
        to: this.refs.timefilter.state.endDate,
      }
    })
    .then((resp) => {
      if(resp.status == 200 && 
        resp.data.results != null
      ){
        //this.refs.table.setData(resp.data.results);
        this.setState({
          data: resp.data.results
        });
      }else{
        //this.refs.table.setData([]);
        this.setState({
          data: []
        });
      }
    });
  }
  onChange(e){
    this.setState({
      query: e.target.value
    });
  }
  onChangeTypeChange(e){
    this.setState({
      chartType: e.target.value
    });
  }
  render() {
    const { title } = this.props;
    return (
      <EuiPage className="custom-plugin">
        <EuiPageBody>
          <EuiPageContent>
            <EuiPageContentBody>
              <EuiFlexGroup alignItems="center">
                <EuiFlexItem>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <TimeFilter ref="timefilter" />
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiFlexGroup alignItems="center">
                <EuiFlexItem>
                  <EuiFieldSearch 
                    placeholder="Search..." 
                    value={this.state.query}
                    onChange={this.onChange.bind(this)}
                    fullWidth 
                    compressed />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButtonIcon iconType="search" onClick={this.search.bind(this)} />
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiFlexGroup>
                <EuiFlexItem grow={false}>
                  <EuiSelect
                    options={[
                      { value: 'Table', text: 'Table' },
                      { value: 'Bar Chart', text: 'Bar Chart' },
                      { value: 'Line Chart', text: 'Line Chart' },
                      { value: 'Pie Chart', text: 'Pie Chart' },
                    ]}
                    value={this.state.chartType}
                    onChange={this.onChangeTypeChange.bind(this)}
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
              <EuiFlexGroup>
                <EuiFlexItem style={{overflow:'hidden',minHeight:'300px'}}>
                  <Display data={this.state.data} chartType={this.state.chartType} />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
  
};
