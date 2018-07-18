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
import { Display } from "../display/display";
import datemath from '@kbn/datemath'

export class Search extends React.Component {
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
  refresh(){
    this.search();
  }
  timeUpdate(time){
    this.search();
  }
  search(){
    var { $http, timefilter } = this.props.$kibana;

    $http.post("../api/piping-search-plugin/search", {
      query: this.state.query,
      date_range: {
        field: "@timestamp",
        from: datemath.parse(timefilter.time.from).toJSON(),
        to: datemath.parse(timefilter.time.to).toJSON(),
      }
    })
    .then((resp) => {
      if(resp.status == 200 && 
        resp.data.results != null
      ){
        this.setState({
          data: resp.data.results
        });
      }else{
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
    return (
      <EuiPage>
        <EuiPageBody>
          <EuiPageContent>
            <EuiPageContentBody>
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
