import React from 'react'
import { useQuery } from 'react-query'
import { Row, Col, Button, Typography, Skeleton } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useHistory } from 'react-router-dom';
import UserDetails from '../components/UserDetails';
const { Title } = Typography;

const fetchUsers = async () => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/users`)
  return res.json()
}
const Users = () => {
  const { data: userList } = useQuery('userList', fetchUsers)
  const history = useHistory();
  return (
    <>
      <Row>
        <Col flex="1" style={{ padding: 25, background: '#ececec' }}>
          <Title type="primary" level={1} strong>Users</Title>
          <br />
          <Button size="large" type="primary" onClick={() => history.push('/users/create')}>
            <PlusOutlined /> Create User
          </Button>
          <div style={{ marginTop: 20 }}>
            {
              userList
                ? userList.map(
                  item => <Row key={item._id}>
                    <Col flex="1">
                      <div style={{}}>
                        <Link to={`/users/update/${item._id}`}>
                          <UserDetails user={item} />
                        </Link>
                      </div>
                    </Col>
                  </Row>
                )
                : <>
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                </>
            }
          </div>
        </Col>
      </Row>
    </>
  )
}

export default Users
