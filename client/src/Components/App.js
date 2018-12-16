import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUp";
import PwdRecovery from "./AccountRecovery";
import ActivateAccount from "./ActivateAccount";
import PageNotFound from './PageNotFound'
import MyAccount from "./MyAccount";
import AdminBoard from "./AdminBoard";
import AccountsManagement from "./AccountsManagement";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/activate" component={ActivateAccount} />
          <Route exact path="/recovery" component={PwdRecovery} />
          <Route exact path="/dashboard" component={AdminBoard} />
          <Route exact path="/account-activity" component={AdminBoard} />
          <Route exact path="/accounts-management" component={AccountsManagement} />
          <Route exact path="/profile" component={MyAccount} />
          <Route exact path="/*" component={PageNotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
