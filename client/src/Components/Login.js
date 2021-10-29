import React, { useEffect, useState } from 'react';
import '../Styles/Signup.css';
import {
  Form, Input, Button, Checkbox, notification,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {useMutation, useQuery} from '@apollo/client';
import {
  Link,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { LOGIN_USER } from '../GraphQL/Mutations';
import { userLogin } from '../Redux';

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [login] = useMutation(LOGIN_USER);
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const { username, password } = values;
      login({
        variables: {
          username,
          password,
        },
      }).then((res) => {
        localStorage.setItem('currentUser', JSON.stringify(res.data.login));
        dispatch(userLogin(res.data.login));
        history.push('/Profile');
      }).catch((err) => (
        notification.error({
          message: err.name,
          description: err.message,
        })
      ));
    });
  };

  return (
    <div className="Interface">
      <div className="user-form">
        <h1>Login</h1>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          form={form}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form.Item>
          <div className="submit-button">
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
              <br />
              Or
              <br />
              <Link to="/">
                Register Now
              </Link>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
