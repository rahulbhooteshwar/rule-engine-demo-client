import React, { useEffect, useState } from 'react';
import { Layout, Menu, notification, Result } from 'antd';
import { ScheduleOutlined, UsergroupAddOutlined, LoginOutlined, PicLeftOutlined } from '@ant-design/icons';
import { NavLink, useLocation, Route, Switch, Redirect, Link } from 'react-router-dom';
import Rules from './pages/Rules';
import CreateUpdateRule from './pages/CreateUpdateRule';
import Users from './pages/Users';
import CreateUpdateUser from './pages/CreateUpdateUser';
import Contents from './pages/Contents';
import ConfigureContentRules from './pages/ConfigureContentRules';
import SimulateUserSession from './pages/SimulateUserSession';

const { Header, Content, Footer } = Layout;

function App() {
  const [accepted, setAccepted] = useState(localStorage.getItem('termsAccepted'))
  useEffect(() => {
    if (!accepted) {
      notification.warning({
        message: <h2 style={{ color: '#FAB120' }}>Important Instructions</h2>,
        duration: null,
        description: (
          <ul>
            <li>All the data used is <strong>fictitious</strong></li>
            <li>User & content image thumbnails are generated randomly & should not be associated with any kind of <strong>race/color/gender discrimination</strong></li>
            <li>Available features are just for <strong>demo purpose</strong> & may differ from actual requirements</li>
            <li>By <strong>clicking or closing</strong> this notification, you agree with above conditions!</li>
          </ul>
        ),
        style: {
          width: '100%'
        },
        onClick: () => {
          setAccepted(true)
          localStorage.setItem('termsAccepted', true)
        },
        onClose: () => {
          setAccepted(true)
          localStorage.setItem('termsAccepted', true)
        }
      });
    }
  }, [accepted])
  const location = useLocation();
  return (
    <Layout className="layout">
      <Header>
        <Link to="/">
          <div className="logo" >RULE ENGINE DEMO</div>
        </Link>
        <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname,]}>
          <Menu.Item key="/users">
            <NavLink to="/users">
              <UsergroupAddOutlined />
              <strong>Users</strong>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/rules">
            <NavLink to="/rules">
              <ScheduleOutlined />
              <strong>Rules</strong>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/contents">
            <NavLink to="/contents">
              <PicLeftOutlined />
              <strong>Contents</strong>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/simulate">
            <NavLink to="/simulate">
              <LoginOutlined />
              <strong>Simulate User Session</strong>
            </NavLink>
          </Menu.Item>
        </Menu>
      </Header>
      <Content>
        <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
          {
            accepted ?
              <Switch>
                <Route path="/simulate">
                  <SimulateUserSession />
                </Route>
                <Route path="/contents/:_id">
                  <ConfigureContentRules />
                </Route>
                <Route path="/contents">
                  <Contents />
                </Route>
                <Route path="/rules/create">
                  <CreateUpdateRule />
                </Route>
                <Route path="/rules/update/:_id">
                  <CreateUpdateRule />
                </Route>
                <Route path="/rules">
                  <Rules />
                </Route>
                <Route path="/users/create">
                  <CreateUpdateUser />
                </Route>
                <Route path="/users/update/:_id">
                  <CreateUpdateUser />
                </Route>
                <Route path="/users">
                  <Users />
                </Route>
                <Route path="/">
                  <Redirect to="/users" />
                </Route>
              </Switch>

              : <Result
                style={{paddingTop: 200}}
                status="500"
                title="Let's be clear at first place"
                subTitle="Read & Close the notification to continue."
              />
          }
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  );
}

export default App;
