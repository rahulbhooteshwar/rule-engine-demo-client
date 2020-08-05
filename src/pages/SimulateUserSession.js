import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/UserContext'
import { Select, message, Result, Card, Tag, Spin, Row, Col } from 'antd'
import Axios from 'axios';
import Avatar from 'antd/lib/avatar/avatar';
import { Link } from 'react-router-dom';
const { Option } = Select;

const SimulateUserSession = () => {
  const { user, setUser, userList } = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [contents, setContents] = useState()
  const onUserSelect = (value) => {
    const selected = userList.find(({ _id }) => _id === value)
    setUser(selected)
  }
  useEffect(() => {
    if (user) {
      setLoading(true);
      (async () => {
        try {
          const { data } = await Axios.get(`${process.env.REACT_APP_API_URL}/targetted-contents/${user._id}`);
          setContents(data)
          setLoading(false)
        } catch (e) {
          message.error(e.message, 3)
          setLoading(false)
        }
      })()
    }

  }, [user])
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <Select
          loading={!userList}
          value={user && user._id}
          size='large'
          showSearch
          style={{ width: 200 }}
          placeholder="Select a User"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={onUserSelect}
        >
          {
            userList && userList.map(user => <Option key={user._id} value={user._id}>{user.name}</Option>)
          }
        </Select>
      </div>
      <div>

        {
          user
            ? <>
              <Card bordered style={{ width: '100%', marginTop: 20 }}>
                <Avatar shape="circle" size={40} src={user.image} />
                <h4 style={{ display: 'inline-block' }}>
                  {user.name} &nbsp;
                  <Tag color="magenta">REGION : <strong>{user.region.title}</strong></Tag>
                  <Tag color="orange">COUNTRY : <strong>{user.country.title}</strong> </Tag>
                  <Tag color="green">LANGUAGE : <strong>{user.lang.title}</strong> </Tag>
                  <Tag color="blue">MARKET : <strong>{user.market.title}</strong> </Tag>
                  <Tag color="purple">SEGMENT : <strong>{user.issuerSegmentation.title}</strong></Tag>
                </h4>
              </Card>
              <Spin size="large" spinning={loading}>
                <Row gutter={3}>
                  {
                    contents ? contents.map((content) => {
                      return <Col span="6" key={content._id}>
                        <Card bordered style={{ height: '100%', width: '100%', marginTop: 20 }}>
                          <Avatar shape="circle" size={64} src={content.image} />
                          <h3 style={{ display: 'inline-block' }}>
                            {content.title}
                          </h3>
                          <h3>
                            {
                              content.rules.map(rule => <Tag key={rule._id} color="green"><Link to={`/rules/update/${rule._id}`}><strong>RULE: {rule.title}</strong></Link></Tag>)
                            }
                          </h3>
                        </Card>
                      </Col>
                    }) : ''
                  }
                </Row>
              </Spin>
            </>
            : <Result
              title="Please sign in as a User from above selector"
            />
        }
      </div>

    </>
  )
}

export default SimulateUserSession
