import React from "react";
import ReactDOM from "react-dom";
//import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import Login from "views/Login.js";
import AdminLayout from "layouts/Admin/Admin.js";
import RTLLayout from "layouts/RTL/RTL.js";
import ManagerLayout from "layouts/Manager/Manager.js";
import TchcLayout from "layouts/TCHC/TCHC.js";
import Director from "layouts/Director/Director.js";
import Fix from "layouts/Fix/Fix.js";

import "assets/scss/black-dashboard-react.scss";
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";
import "assets/css/new.css";
import history from "history.js";

//const hist = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <Switch>
      <Route path="/admin" render={props => <AdminLayout {...props} />} />
      <Route path="/user" render={props => <RTLLayout {...props} />} />
      <Route path="/manager" render={props => <ManagerLayout {...props} />} />
      <Route path="/tchc" render={props => <TchcLayout {...props} />} />
      <Route path="/director" render={props => <Director {...props} />} />
      <Route path="/fix" render={props => <Fix {...props} />} />
      <Route path="/login" component={Login}/>
      
      <Redirect from="/" to="/login"/>
    </Switch>
  </Router>,
  document.getElementById("root")
);
