import React from 'react'
import { useQuery } from 'react-query'
import { Spin, Row, Col, Card, Tag } from 'antd'
import Avatar from 'antd/lib/avatar/avatar'
import { Link } from 'react-router-dom'

const fetchContent = async (_key, userId) => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/targetted-contents/${userId}`)
  return res.json()
}
function UserContents({ userId }) {
  const { data: contents, status } = useQuery(['userContents', userId], fetchContent)
  return (
    <Spin size="large" spinning={status === 'loading'}>
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
                    content.rules.map(rule => <Tag key={rule._id} color="green">
                      <Link to={`/rules/update/${rule._id}`}>
                        <strong>RULE: {rule.title}</strong>
                      </Link>
                    </Tag>)
                  }
                </h3>
              </Card>
            </Col>
          }) : ''
        }
      </Row>
    </Spin>
  )
}

export default UserContents
