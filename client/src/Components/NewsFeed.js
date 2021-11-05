import React, { useState } from 'react';
import {
  Input, notification, Button, Form, Tooltip, Avatar,
} from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { CommentOutlined, LikeOutlined, UserOutlined } from '@ant-design/icons';
import { GET_POSTS, VERIFY_USER } from '../GraphQL/Queries';
import { CREATE_COMMENT, CREATE_POST } from '../GraphQL/Mutations';

const { TextArea } = Input;

function NewsFeed() {
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { data: postData } = useQuery(GET_POSTS);
  const [showComment, setShowComment] = useState(false);
  const [createPost] = useMutation(CREATE_POST);
  const [createComment] = useMutation(CREATE_COMMENT);
  const [statusPost, setStatusPost] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [form] = Form.useForm();
  const history = useHistory();
  const verifyUser = () => {
    const { error } = useQuery(VERIFY_USER);
    if (error) {
      notification.error({
        message: error.name,
        description: error.message,
      });
      localStorage.removeItem('currentUser');
      history.push('/Login');
    } else {
      console.log('User Authenticated !');
    }
  };
  if (loggedInUser != null) {
    verifyUser();
  }
  const postUpdate = () => {
    form.validateFields().then((values) => {
      const { body } = values;
      createPost({
        variables: {
          body,
        },
      }).then((res) => {
        console.log(res.data);
        setStatusPost('');
      }).catch((err) => (
        notification.error({
          message: err.name,
          description: err.message,
        })
      ));
    });
  };
  const postComment = (values) => {
    const { body, postId } = values;
    createComment({
      variables: {
        postId,
        body,
      },
    }).then((res) => {
      console.log(res.data);
    }).catch((err) => (
      notification.error({
        message: err.name,
        description: err.message,
      })
    ));
  };
  return (
    <div className="main-page">
      <div className="newsfeed">
        <div className="visible-posts">
          {postData?.getPosts.map((post) => (
            <div className="full-post">
              <div className="status-posts">
                <div className="posted-by">
                  <Avatar
                    size={30}
                    style={{ backgroundColor: `# ${Math.floor(Math.random() * 16777215).toString(16)}` }}
                    icon={<UserOutlined />}
                  />
                &nbsp;
                  {post.user}
                  <div className="timestamp">
                    {new Date(post.createdAt).toLocaleTimeString('en-GB')}
                    <br />
                    {new Date(post.createdAt).toLocaleDateString('en-GB')}
                  </div>
                </div>
                <br />
                <div className="post-body">{post.body}</div>
              </div>
              <div className="like-comment">
                <div className="like-button">
                  <LikeOutlined />
                  Like
                </div>
                <div className="comment-button" onClick={() => setShowComment(!showComment)} role="button">
                  <CommentOutlined />
                  Comment
                </div>
              </div>
              <div className="comment-section">
                {post.comments.map((comment) => (
                  <div className="single-comment">
                    <Avatar
                      size={30}
                      style={{ backgroundColor: `# ${Math.floor(Math.random() * 16777215).toString(16)}` }}
                      icon={<UserOutlined />}
                    />
                  &nbsp;
                    <div className="comment-username">{comment.username}</div>
                  &nbsp;
                    <div className="comment-body">{comment.body}</div>
                    <div className="comment-timestamp">
                      {new Date(post.createdAt).toLocaleTimeString('en-GB')}
                      <br />
                      {new Date(post.createdAt).toLocaleDateString('en-GB')}
                    </div>
                  </div>
                ))}
              </div>
              {showComment === true ? (
                <div className="write-comment">
                  <Form
                    name="comment_post"
                    layout="inline"
                    className="comment-form"
                    initialValues={{ remember: true }}
                    onFinish={postComment}
                  >
                    <Form.Item
                      name="body"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="postId"
                      initialValue={post.id}
                    />
                    <Button htmlType="submit">
                      Submit
                    </Button>
                  </Form>
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="write-status">
          <Form
            name="status_post"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={postUpdate}
            form={form}
          >
            <Form.Item
              name="body"
            >
              <TextArea size="large" showCount maxLength={200} value={statusPost} onChange={(e) => setStatusPost(e.target.value)} />
            </Form.Item>
            <div className="post-button">
              <Button htmlType="submit">
                Post
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default NewsFeed;
