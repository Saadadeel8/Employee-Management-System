import React from 'react';
import '../Styles/Signup.css';
import {
  Form, Input, Button, Checkbox, Alert,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import {
  Link,
} from 'react-router-dom';
import { LOGIN_USER } from '../GraphQL/Mutations';

const Login = () => {
  // const history = useHistory();

  const [login] = useMutation(LOGIN_USER);

  const handleSubmit = (values) => {
    login({
      variables: {
        username: values.username,
        password: values.password,
      },
    }).catch((err) => (
      <Alert
        message="Error"
        description={err}
        type="error"
        showIcon
      />
    ));
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
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
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
