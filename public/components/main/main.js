import React from "react";
import { TopNav } from './topnav';
import { Search } from "./search";
import { Lookup } from "./lookup";

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTabId: 'search',
    };
    this.component = null;
    this.tabs = [{
      id: 'search',
      name: 'Search',
      disabled: false,
      autoRefresh: true,
      timefilter: true,
      component: <Search ref={(c)=>{ this.component=c }}
        $kibana={this.props.$kibana}
      />,
    },{
      id: 'lookup',
      name: 'Lookup',
      disabled: false,
      autoRefresh: false,
      timefilter: false,
      component: <Lookup ref={(c)=>{ this.component=c }} 
        $kibana={this.props.$kibana}
      />,
    }];
  }
  componentDidMount() {
  }
  getTabComponent(){
    for(var i=0; i<this.tabs.length; i++){
      if(this.tabs[i].id === this.state.selectedTabId){
        return this.tabs[i].component;
      }
    }
    return null;
  }
  onTabSelected(id){
    this.setState({
      selectedTabId: id
    });
  }
  onRefresh(){
    if(this.component != null && this.component.refresh != null){
      this.component.refresh();
    }
  }
  onTimeUpdate(time){
    if(this.component != null && this.component.timeUpdate != null){
      this.component.timeUpdate(time);
    }
  }
  render() {
    return (
      <div className="piping-search">
        <TopNav 
          $kibana={this.props.$kibana}
          tabs={this.tabs}
          onTabSelected={this.onTabSelected.bind(this)}
          onRefresh={this.onRefresh.bind(this)}
          onTimeUpdate={this.onTimeUpdate.bind(this)}
        />
        {this.getTabComponent()}
      </div>
    );
  }
  
};
