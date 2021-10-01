import React, { useState } from 'react';
import '../Styles/Signup.css';
import {
  Form, Input, Button,
} from 'antd';
import { useMutation } from '@apollo/client';
import {
  Link,
} from 'react-router-dom';
import { CREATE_NEW_USER } from '../GraphQL/Mutations';

const Signup = () => {
  // const history = useHistory();
  const [errors, setErrors] = useState();
  // const [fields, setFields] = useState([{ name: ['username'], value: '' }]);
  const [form] = Form.useForm();

  const [register, { loading }] = useMutation(CREATE_NEW_USER, {
    update(proxy, result) {
      console.log(result);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const {
        name,
        email,
        username,
        password,
      } = values;
      register({
        variables: {
          name,
          email,
          username,
          password,
        },
      });
    }).catch((err) => {
      console.log(err);
    });
  };

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div className="Interface">
      <div className="user-form">
        <h1>User Sign Up</h1>
        <Form
          name="global_state"
          layout="inline"
          form={form}
        >
          <div className="form-item">
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Full Name is required!',
                },
              ]}
            >
              <Input placeholder="Full Name" />
            </Form.Item>
          </div>
          <div className="form-item">
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: 'E-mail is required!',
                },
              ]}
            >
              <Input placeholder="Email ID" />
            </Form.Item>
          </div>
          <div className="form-item">
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Username is required!',
                },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>
          </div>
          <div className="form-item">
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
          </div>
          <div className="submit-button">
            <Form.Item>
              <br />
              <Button type="primary" disabled={loading} onClick={() => handleSubmit()}>
                {loading ? 'Creating Account' : 'Submit'}
              </Button>
              <br />
              <br />
            </Form.Item>
          </div>
        </Form>
        Already have an account?
        <Link to="/Login"> Login</Link>
      </div>
    </div>
  );
};

export default Signup;
