import React from "react";
import {
  EuiForm,
  EuiFormRow,
  EuiSelect,
  EuiTextArea,
  EuiSpacer,
} from '@elastic/eui';

export class VisEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  shouldComponentUpdate(nextProps, nextState){
    return true;
  }
  componentDidMount() {
  }
  componentDidUpdate() {
  }
  getParams(){
    return this.props.scope.vis.params;
  }
  onChangeTypeChange(e){
    this.getParams().chartType = e.target.value;
    this.triggerParamChange();
  }
  onQueryChange(e){
    this.getParams().query = e.target.value;
    this.triggerParamChange();
  }
  triggerParamChange(){
    this.props.stageEditorParams(this.getParams());
  }
  render() {
    return (
      <EuiForm>
        <EuiFormRow label="Chart Type">
          <EuiSelect
            options={[
              { value: 'Table', text: 'Table' },
              { value: 'Bar Chart', text: 'Bar Chart' },
              { value: 'Line Chart', text: 'Line Chart' },
              { value: 'Pie Chart', text: 'Pie Chart' },
            ]}
            value={this.getParams().chartType}
            onChange={this.onChangeTypeChange.bind(this)}
          />
        </EuiFormRow>
        <EuiFormRow label="Query">
          <EuiTextArea
            placeholder="Please enter query here"
            value={this.getParams().query}
            onChange={this.onQueryChange.bind(this)}
            compressed
          />
        </EuiFormRow>
      </EuiForm>
    );
  }
};
