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

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Layout>
            <Switch>
              {/* <Route path="/home" component={HomePage} /> */}
              <Route path="/table" component={Dashboard} />
              <Route path="/services" component={ServiceList} />
              <Route path="/report" component={Report} />
              <Route path="/login" component={SignIn} />
              <Route path="/register" component={SignUp} />
              <Redirect from="*" to="/table" />
            </Switch>
          </Layout>
        </BrowserRouter>
      </div>
    );
  }
}
