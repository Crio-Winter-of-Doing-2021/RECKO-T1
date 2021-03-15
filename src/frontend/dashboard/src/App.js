import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";

import SignIn from "./components/authentication/SignIn";
import SignUp from "./components/authentication/SignUp";
import Dashboard from "./components/dashboard/Dashboard";
import ServiceList from "./components/ApiAuthenticationPage/ServiceList";

import Layout from "./Layout/Layout";
import Report from "./components/charts/Reports";

function PrivateRoute() {
  return (
    <Layout>
      <Switch>
        <Route path="/table" component={Dashboard} />
        <Route path="/services" component={ServiceList} />
        <Route path="/report" component={Report} />
        <Redirect from="*" to="/table" />
      </Switch>
    </Layout>
  );
}

function DefaultRoute() {
  return (
    <Switch>
      <Route path="/login" component={SignIn} />
      <Route path="/register" component={SignUp} />
      <Redirect from="*" to="/login" />
    </Switch>
  );
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: true,
    };
  }
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          {this.isAuthenticated ? <PrivateRoute /> : <PrivateRoute />}
        </BrowserRouter>
      </div>
    );
  }
}
