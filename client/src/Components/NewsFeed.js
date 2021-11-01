import React, { useState } from 'react';
import { Input, notification, Button } from 'antd';
import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { VERIFY_USER } from '../GraphQL/Queries';

const { TextArea } = Input;

function NewsFeed() {
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const history = useHistory();
  const [statusPost, setStatusPost] = useState('');
  const verifyUser = () => {
    const { error } = useQuery(VERIFY_USER);
    if (error) {
      notification.error({
        message: error.name,
        description: error.message,
      });
      history.push('/Login');
      localStorage.removeItem('currentUser');
    } else {
      console.log('User Authenticated !');
    }
  };
  if (loggedInUser != null) {
    verifyUser();
  }
  const postUpdate = () => {

  };
  return (
    <div className="main-page">
      <div className="left-sidebar-empty" />
      <div className="newsfeed">
        <div className="status-post">
          <TextArea size="large" showCount onChange={(e) => setStatusPost(e)} maxLength={200} />
          <div className="post-button">
            <Button onClick={postUpdate}>
              Post
            </Button>
          </div>
        </div>
      </div>
      <div className="right-sidebar-empty" />
    </div>
  );
}

export default NewsFeed;
