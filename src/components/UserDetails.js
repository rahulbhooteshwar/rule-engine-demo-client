import React from 'react'
import Avatar from 'antd/lib/avatar/avatar'
import { Card, Tag } from 'antd'

function UserDetails({ user }) {
  return (
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
  )
}

export default UserDetails
