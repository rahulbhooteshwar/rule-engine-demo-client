import React, { useState } from 'react'
import { Select, Result } from 'antd'

import { useQuery } from 'react-query';
import UserDetails from '../components/UserDetails';
import UserContents from '../components/UserContents';
const { Option } = Select;
const fetchUsers = async () => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/users`)
  return res.json()
}
const SimulateUserSession = () => {
  const { data:userList } = useQuery('userList', fetchUsers)
  const [currentUser, setCurrentUser] = useState()
  const onUserSelect = (value) => {
    setCurrentUser(userList.find(({_id}) => _id === value))
  }
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <Select
          loading={!userList}
          value={currentUser && currentUser._id}
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
          currentUser
            ? <>
              <UserDetails user={currentUser} />
              <UserContents userId={currentUser._id}/>
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
