import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import InboxPage from "./InboxPage"
import DashboardPage from './DashboardPage'
import LoadingPage from "../LoadingPage"
import EditProfilePage from "./EditProfilePage"
import MainTemplate from "../MainTemplate"

export default class MemberPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { init: false };
  }

  componentDidMount() {
    if(!this.props.system.checkAuth()) {
      return;
    }
    this.setState({init:true})
  }

  render() {
    let match = this.props.match;
    if (!this.state.init) {
      return <LoadingPage />
    }
    return (
      <MainTemplate {...this.props}>
            <Switch>
              <Route exact path={`${match.path}editProfile/`}  render={props=>{return <EditProfilePage {...props} system={this.props.system} />}} />
              <Route exact path={`${match.path}inbox/:memberId/`} render={props=>{return <InboxPage {...props} system={this.props.system} />}} />
              <Route path={`${match.path}inbox/`} render={props=>{return <InboxPage {...props} system={this.props.system} />}}  />
              <Route exact path={match.path} render={props=>{return <DashboardPage {...props} system={this.props.system} />}} />
            </Switch>
        
      </MainTemplate>
    )
  }
}