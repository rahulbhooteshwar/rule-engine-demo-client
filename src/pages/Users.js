import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Button, Typography, message, Skeleton, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Axios from 'axios';
import Avatar from 'antd/lib/avatar/avatar';
import { Link, useHistory } from 'react-router-dom';
const { Title} = Typography;

const Users = () => {
  const history = useHistory();
  const [users, setUsers] = useState();
  useEffect(() => {
    (async () => {
      try {
        const { data } = await Axios.get(`${process.env.REACT_APP_API_URL}/users`);
        setUsers(data)
      } catch (e) {
        message.error(e.message, 3)
      }
    })()
  }, []);
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
              users
                ? users.map(
                  item => <Row key={item._id}>
                    <Col flex="1">
                      <div style={{}}>
                        <Link to={`/users/update/${item._id}`}>
                        <Card bordered style={{ width: '100%', marginTop: 20 }}
                          hoverable>
                          <Avatar shape="circle" size={64} src={item.image} />
                          <h2 style={{ display: 'inline-block' }}>
                            {item.name}
                          </h2>
                          <h3>
                            <Tag color="magenta">REGION : <strong>{item.region.title}</strong></Tag>
                            <Tag color="orange">COUNTRY : <strong>{item.country.title}</strong> </Tag>
                            <Tag color="green">LANGUAGE : <strong>{item.lang.title}</strong> </Tag>
                            <Tag color="blue">MARKET : <strong>{item.market.title}</strong> </Tag>
                            <Tag color="purple">SEGMENT : <strong>{item.issuerSegmentation.title}</strong></Tag>
                          </h3>
                          </Card>
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
