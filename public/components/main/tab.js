import React from "react";

import {
  EuiTabs,
  EuiTab,
} from "@elastic/eui";

export class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTabId: 'search',
    };
  }
  componentDidMount() {
  }
  onSelectedTabChanged = id => {
    this.setState({
      selectedTabId: id,
    });
    if(this.props.onTabSelected != null){
      this.props.onTabSelected(id);
    }
  }
  renderTabs() {
    return this.props.tabs.map((tab, index) => (
      <EuiTab
        onClick={() => this.onSelectedTabChanged(tab.id)}
        isSelected={tab.id === this.state.selectedTabId}
        disabled={tab.disabled}
        key={index}
      >
        {tab.name}
      </EuiTab>
    ));
  }
  render() {
    return (
      <EuiTabs>
        {this.renderTabs()}
      </EuiTabs>
    );
  }
};
