import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { history } from "./utils/history";
import SignIn from "./components/authentication/SignIn";
import SignUp from "./components/authentication/SignUp";
import Dashboard from "./components/dashboard/Dashboard";

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router history={history}>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/login" component={SignIn} />
            <Route path="/register" component={SignUp} />
            <Redirect from="*" to="/login" />
          </Switch>
        </Router>
      </div>
    );
  }
}
