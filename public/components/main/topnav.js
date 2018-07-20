import React from "react";
import { render, unmountComponentAtNode } from 'react-dom';
import { timepicker } from 'ui/timepicker';
import { kbn_top_nav } from 'ui/kbn_top_nav';
import { listen } from 'ui/listen';
import { prettyDuration } from 'ui/directives/pretty_duration';
import { Tab } from "./tab";


export class TopNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    var { timefilter, $scope, $compile, $timeout } = this.props.$kibana;

    timefilter.init();
    timefilter.enableAutoRefreshSelector();
    timefilter.enableTimeRangeSelector();
    $scope.topNavMenu = [];

    let refresher;
    var refreshFunc = this.refresh.bind(this);
    $scope.$watchCollection('timefilter.refreshInterval', 
      (interval) => {
        if (refresher) $timeout.cancel(refresher);
        if (interval.value > 0 && !interval.pause) {
          function startRefresh() {
            refresher = $timeout(function () {
              if (!$scope.running) refreshFunc();
              startRefresh();
            }, interval.value);
          }
          startRefresh();
        }
      }
    );

    $scope.$watchCollection('timefilter.time',
      (time) => {
        this.timeUpdate(time);
      }
    );

    //render kibana angular component
    var compiled = $compile(
      this.refs.nav
    )($scope);
    $(this.refs.nav).append(compiled);

    //render react component inside angular component
    this.tabReact = <Tab 
      tabs={this.props.tabs}
      onTabSelected={this.tabSelected.bind(this)} 
    />;
    render(this.tabReact, compiled.find("#react-tab")[0]);
  }
  getTab(id){
    for(var i=0; i<this.props.tabs.length; i++){
      if(this.props.tabs[i].id === id){
        return this.props.tabs[i];
      }
    }
    return null;
  }
  updateNav(tabId){
    var { timefilter, $scope } = this.props.$kibana;
    var tab = this.getTab(tabId);
    if(tab.autoRefresh){
      timefilter.enableAutoRefreshSelector();
    }else{
      timefilter.disableAutoRefreshSelector();
    }
    if(tab.timefilter){
      timefilter.enableTimeRangeSelector();
    }else{
      timefilter.disableTimeRangeSelector();
    }
    //apply changes
    $scope.$applyAsync();
  }
  tabSelected(id){
    this.updateNav(id);
    if(this.props.onTabSelected != null){
      this.props.onTabSelected(id);
    }
  }
  refresh(){
    if(this.props.onRefresh != null){
      this.props.onRefresh();
    }
  }
  timeUpdate(time){
    if(this.props.onTimeUpdate != null){
      this.props.onTimeUpdate(time);
    }
  }
  render() {
    return (
      <div ref="nav">
        <kbn-top-nav name="pipingSearchPlugin" config="topNavMenu">
          <div data-transclude-slots>
            <div data-transclude-slot="topLeftCorner">
              <div id="react-tab"></div>
            </div>
          </div>
        </kbn-top-nav>
      </div>
    );
  }
};
