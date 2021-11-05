import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar, notification, Spin, Space, Tooltip,
} from 'antd';
import { useQuery } from '@apollo/client';
import { PoweroffOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import Login from '../Components/Login';
import Signup from '../Components/Signup';
import Profile from '../Components/Profile';
import NewsFeed from '../Components/NewsFeed';
import logo from '../Components/logo.png';
import '../App.css';
import { VERIFY_USER } from '../GraphQL/Queries';
import { userLogout } from '../Redux';

function Routes() {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { loading, error: err, data } = useQuery(VERIFY_USER);
  if (loading) {
    return (
      <div className="loading-spinner">
        <Space size="large">
          <Spin size="large" />
        </Space>
      </div>
    );
  }
  if (err) {
    notification.error({
      message: err.name,
      description: err.message,
    });
  }
  const logout = () => {
    localStorage.removeItem('currentUser');
    dispatch(userLogout());
    window.location.href = 'Login';
  };
  const profilePictureClick = () => {
    window.location.href = 'Profile';
  };
  return (
    <Router>
      <div>
        <div className="top-bar">
          <div className="wc-logo"><img src={logo} alt="logo" /></div>
          {console.log(loggedInUser)}
          {loggedInUser ? (
            <div className="display-logout">
              <div className="photo-left" onClick={() => profilePictureClick()}>
                <Tooltip title="Back to Profile">
                  <Avatar
                    size={60}
                    style={{
                      color: '#ffffff',
                      backgroundColor: '#3886d3',
                      fontSize: '20px',
                    }}
                  >
                    {loggedInUser.user.name.split(' ').map((n) => n[0]).join('.')}
                  </Avatar>
                </Tooltip>
              </div>
              <div className="logout-button" onClick={() => logout()}>
                <PoweroffOutlined />
                &nbsp;
                Sign out
              </div>
            </div>
          ) : null}
        </div>
        <Switch>
          <Route exact path="/" component={Signup} />
          <Route exact path="/Login" component={Login} />
          <Route exact path="/Profile" component={Profile} />
          <Route exact path="/Newsfeed" component={NewsFeed} />
        </Switch>
      </div>
    </Router>
  );
}

export default Routes;
