import React from "react";
import moment from 'moment';
import {
    EuiDatePicker,
    EuiFlexGroup,
    EuiFlexItem,
    EuiFormRow,
} from "@elastic/eui";

export class TimeFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        startDate: moment().add(-1, 'd'),
        endDate: moment(),
    };

    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
  }
  handleChangeStart(date) {
    this.setState({
      startDate: date
    });
  }

  handleChangeEnd(date) {
    this.setState({
      endDate: date
    });
  }
  render() {
    return (
        <EuiFlexGroup gutterSize="none">
            <EuiFlexItem grow={false}>
                <EuiFormRow label="Start date">
                    <EuiDatePicker
                        selected={this.state.startDate}
                        onChange={this.handleChangeStart}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        showTimeSelect
                    />
                </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
                <EuiFormRow label="End date">
                    <EuiDatePicker
                        selected={this.state.endDate}
                        onChange={this.handleChangeEnd}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        showTimeSelect
                    />
                </EuiFormRow>
            </EuiFlexItem>
        </EuiFlexGroup>
    );
  }
  
};
