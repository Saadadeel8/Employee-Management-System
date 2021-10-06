import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Login from '../Components/Login';
import Signup from '../Components/Signup';
import Profile from '../Components/Profile';
import logo from '../Components/logo.png';
import '../App.css';

function Routes() {
  return (
    <div>
      <div className="top-bar">
        <div className="wc-logo"><img src={logo} alt="logo" /></div>
      </div>
      <Router>
        <Switch>
          <Route exact path="/" component={Signup} />
          <Route exact path="/Login" component={Login} />
          <Route exact path="/Profile" component={Profile} />
        </Switch>
      </Router>
    </div>
  );
}

export default Routes;
