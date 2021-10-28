import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useMutation } from '@apollo/client';
import {
  notification, Avatar, Input, Form, Button, Layout, Tabs, Select, Modal, DatePicker, Radio,
} from 'antd';
import { useHistory } from 'react-router';
import { Option } from 'antd/es/mentions';
import { PoweroffOutlined } from '@ant-design/icons';
import { Tree, TreeNode } from 'react-organizational-chart';
import Calendar from 'react-awesome-calendar';
import { BlockPicker } from 'react-color';
import { userLogout } from '../Redux';
import { GET_ALL_USERS, GET_EVENTS, VERIFY_USER } from '../GraphQL/Queries';
import { CREATE_EVENT } from '../GraphQL/Mutations';

const { TabPane } = Tabs;

function Profile() {
  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { data: userData } = useQuery(GET_ALL_USERS);
  const { data: eventData } = useQuery(GET_EVENTS);
  const dispatch = useDispatch();
  const history = useHistory();
  const [showDesc, setShowDesc] = useState(true);
  const [userDescription, setUserDescription] = useState();
  const { TextArea } = Input;
  const {
    Content, Footer,
  } = Layout;

  const verifyUser = () => {
    const { loading, error, data } = useQuery(VERIFY_USER);
    if (error) {
      notification.error({
        message: error.name,
        description: error.message,
      });
      history.push('/Login');
      localStorage.removeItem('currentUser');
    } else {
      console.log('User Authenticated !');
      console.log(eventData);
    }
  };
  if (loggedInUser != null) {
    verifyUser();
  }
  const logout = () => {
    localStorage.removeItem('currentUser');
    dispatch(userLogout());
    history.push('/Login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout className="site-layout">
        <Content style={{ margin: '0 16px' }}>
          <div className="logout-button" onClick={() => logout()}>
            <PoweroffOutlined />
            &nbsp;
            Sign out
          </div>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <Tabs type="card" tabPosition="left">
              <TabPane tab="Profile" key="1">
                <div className="container">
                  <div className="left col-lg-4">
                    <div className="photo-left">
                      <Avatar
                        size={130}
                        style={{
                          color: '#ffffff',
                          backgroundColor: '#3886d3',
                          fontSize: '50px',
                        }}
                      >
                        {loggedInUser.user.name.split(' ').map((n) => n[0]).join('.')}
                      </Avatar>
                    </div>
                    <h4 className="name">{loggedInUser.user.name}</h4>
                    <p className="info">
                      {loggedInUser.user.designation}
                      {' '}
                      {loggedInUser.user.team}
                    </p>
                    <p className="info">{loggedInUser.user.email}</p>
                    <div className="desc">
                      {showDesc === true
                        ? (
                          <button onClick={() => setShowDesc(!showDesc)}>
                            Edit Description
                          </button>
                        ) : (
                          <div>
                            <TextArea value={userDescription} onChange={setUserDescription} />
                            <button onClick={() => setShowDesc(!showDesc)}>
                              Submit
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane tab="Contact HR" key="2">
                <ContactHR />
              </TabPane>
              <TabPane tab="My Team" key="3">
                <Tree
                  lineWidth="2px"
                  lineColor="green"
                  lineBorderRadius="10px"
                  label={<div className="styled-node">Frontend Team</div>}
                >
                  {userData?.users.filter((user) => user.team === loggedInUser.user.team)
                    .map((user, index) => <TreeNode label={<div key={index} className="styled-node">{user.name}</div>} />)}
                </Tree>
              </TabPane>
              <TabPane tab="My Calendar" key="4">
                <div className="private-calendar"><PvtCalendar events={eventData} /></div>
              </TabPane>
            </Tabs>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>By WanClouds</Footer>
      </Layout>
    </Layout>
  );
}

function ContactHR() {
  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <div className="complaint-form">
      <h1>HR Complaint/Query Form</h1>
      <br />
      <Form name="nest-messages" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              type: 'email',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="designation" label="Designation" rules={[{ required: false }]}>
          <Select
            placeholder="Select your designation"
            allowClear
          >
            <Option value="Team Lead">Team Lead</Option>
            <Option value="Team Member">Team Member</Option>
          </Select>
        </Form.Item>
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
        <Form.Item name="complaint" label="Complaint/Query">
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <div className="complaint-button">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
function PvtCalendar({ events }) {
  const createdBy = useSelector((state) => state.loggedInUser.user.username);
  const [visible, setVisible] = useState(false);
  const [createevent, { loading }, error] = useMutation(CREATE_EVENT);
  const [form] = Form.useForm();

  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    form.validateFields().then(() => {
      const {
        color: { hex: color },
        to: { _d: to },
        from: { _d: from },
        modifier,
        title,
      } = values;
      createevent({
        variables: {
          color,
          to,
          from,
          modifier,
          title,
          createdBy,
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
      description: 'Successfully Added Event',
    });
    setVisible(false);
  };
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setVisible(true);
        }}
      >
        Add New Event
      </Button>
      <CollectionCreateForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      />
      <Calendar events={events.getEvents} />
    </div>
  );
}
const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      forceRender
      visible={visible}
      title="Add an Event"
      okText="Create"
      getContainer={false}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="from"
          label="Start Date"
          rules={[
            {
              type: 'object',
              required: true,
              message: 'Please select time!',
            },
          ]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item
          name="to"
          label="End Date"
          rules={[
            {
              type: 'object',
              required: true,
              message: 'Please select time!',
            },
          ]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item name="color" label="Color">
          <BlockPicker />
        </Form.Item>
        <Form.Item name="modifier" className="collection-create-form_last-form-item">
          <Radio.Group>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default Profile;
