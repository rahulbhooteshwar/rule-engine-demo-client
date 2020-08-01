import React from 'react';
import { Layout, Menu } from 'antd';
import { ScheduleOutlined } from '@ant-design/icons';
import { NavLink, useLocation, Route, Switch, Redirect } from 'react-router-dom';
import Rules from './pages/Rules';
import CreateUpdateRule from './pages/CreateUpdateRule';
import Users from './pages/Users';
import CreateUpdateUser from './pages/CreateUpdateUser';
import Contents from './pages/Contents';
import ConfigureContentRules from './pages/ConfigureContentRules';

const { Header, Content, Footer } = Layout;

function App() {
  const location = useLocation();
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" >RULE ENGINE DEMO</div>
        <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname,]}>
          <Menu.Item key="/users">
            <NavLink to="/users">
              <ScheduleOutlined />
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
              <ScheduleOutlined />
              <strong>Contents</strong>
            </NavLink>
          </Menu.Item>
        </Menu>
      </Header>
      <Content>
        <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
          <Switch>
            <Route path="/contents/:_id">
              <ConfigureContentRules/>
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
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  );
}

export default App;
