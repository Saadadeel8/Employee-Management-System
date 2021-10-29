import React, { useState } from 'react';
import '../Styles/Signup.css';
import {
  Form, Input, Button, Select, notification,
} from 'antd';
import { useMutation } from '@apollo/client';
import {
  Link,
} from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { CREATE_NEW_USER } from '../GraphQL/Mutations';
import { updateUserData, incCurrentStep, decCurrentStep } from '../Redux/Auth/auth.actions';

const { Option } = Select;

const Signup = () => {
  const history = useHistory();
  const currentStep = useSelector((state) => state.currentStep);
  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [showTeamField, setShowTeamField] = useState(true);
  const [register, { loading }, error] = useMutation(CREATE_NEW_USER);

  const teamSelect = (team) => {
    if (team === 'HR') {
      setShowTeamField(false);
    } else {
      setShowTeamField(true);
    }
  };
  const saveBasicForm = () => {
    form.validateFields().then((values) => {
      dispatch(updateUserData(values));
      dispatch(incCurrentStep());
    }).catch((err) => (
      notification.error({
        message: err.name,
        description: err.message,
      })
    ));
  };
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const {
        name, email, username, password,
      } = userData;
      const {
        gender, company, team, designation,
      } = values;
      register({
        variables: {
          name,
          email,
          username,
          password,
          gender,
          company,
          team,
          designation,
        },
      }).catch((err) => (
        notification.error({
          message: err.name,
          description: err.message,
        })
      ));
    }).catch((err) => (
      notification.error({
        message: err.name,
        description: err.message,
      })
    ));
    notification.success({
      message: 'Success',
      description: 'Successfully Signed Up',
    });
    history.push('/Login');
  };
  const BasicData = () => (
    <div>
      <div className="form-item">
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: 'Full name is required!',
            },
            {
              pattern: new RegExp(/[a-zA-Z0-9]{3,}$/),
              message: 'Name is too short',
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
            {
              pattern: new RegExp(/^(([\w]+)\.?)+@(([\w]+)\.?)+\.[a-zA-Z]{2,4}$/),
              message: 'Email format is incorrect',
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
            {
              pattern: new RegExp(/[a-zA-Z0-9]{3,}$/),
              message: 'Username is too short',
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
            {
              pattern: new RegExp(/[a-zA-Z0-9]{6,}$/),
              message: 'Password is too short',
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
      </div>
    </div>
  );
  const AdditionalData = () => (
    <div>
      <div className="form-item">
        <Form.Item name="gender" rules={[{ required: true }]}>
          <Select
            placeholder="Your Gender"
            allowClear
          >
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>
      </div>
      <div className="form-item">
        <Form.Item
          name="company"
          rules={[
            {
              required: true,
              message: 'Company Name is required!',
            },
          ]}
        >
          <Input placeholder="Company Name" />
        </Form.Item>
      </div>
      <div className="form-item">
        <Form.Item name="designation" rules={[{ required: true }]}>
          <Select
            placeholder="Select your designation"
            onChange={(team) => teamSelect(team)}
            allowClear
          >
            <Option value="Team Lead">Team Lead</Option>
            <Option value="Team Member">Team Member</Option>
            <Option value="HR">HR</Option>
          </Select>
        </Form.Item>
      </div>
      {showTeamField === true
        ? (
          <div className="form-item">
            <Form.Item name="team" rules={[{ required: false }]}>
              <Select
                placeholder="Select your team"
                allowClear
              >
                <Option value="Frontend">FrontEnd</Option>
                <Option value="Backend">BackEnd</Option>
                <Option value="Dev-Ops">Dev Ops</Option>
                <Option value="Networking">Networking</Option>
                <Option value="Sec-Ops">Sec Ops</Option>
              </Select>
            </Form.Item>
          </div>
        ) : null }
      <div role="button" className="back-button" onClick={() => dispatch(decCurrentStep())}>
        <LeftOutlined />
        Back
      </div>
    </div>
  );
  const formData = [<BasicData />, <AdditionalData />];
  return (
    <div className="Interface">
      <div className="user-form">
        <h1>User Sign Up</h1>
        <Form
          name="global_state"
          layout="inline"
          form={form}
        >
          {formData[currentStep]}
          <div className="submit-button">
            {currentStep === 0 ? <Button onClick={() => saveBasicForm()}> Next </Button> : (
              <Button type="primary" disabled={loading} onClick={() => handleSubmit()}>
                {loading ? 'Creating Account' : 'Submit'}
              </Button>
            )}
          </div>
        </Form>
        Already have an account?
        <Link to="/Login"> Login</Link>
      </div>
    </div>
  );
};

export default Signup;
