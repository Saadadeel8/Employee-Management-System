import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { notification } from 'antd';
import { useQuery } from '@apollo/client';
import Login from '../Components/Login';
import Signup from '../Components/Signup';
import Profile from '../Components/Profile';
import logo from '../Components/logo.png';
import '../App.css';
import { VERIFY_USER } from '../GraphQL/Queries';

function Routes() {
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { loading, error: err, data } = useQuery(VERIFY_USER);
  if (loading) return 'Loading...';
  if (err) {
    notification.error({
      message: err.name,
      description: err.message,
    });
  }

  return (
    <Router>
      <div>
        <div className="top-bar">
          <div className="wc-logo"><img src={logo} alt="logo" /></div>
          {console.log(loggedInUser)}
        </div>
        <Switch>
          <Route exact path="/" component={Signup} />
          <Route exact path="/Login" component={Login} />
          <Route exact path="/Profile" component={Profile} />
        </Switch>
      </div>
    </Router>
  );
}

export default Routes;
