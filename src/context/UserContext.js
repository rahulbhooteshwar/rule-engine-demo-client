import React, { useState, useReducer, useEffect } from 'react'
import Axios from 'axios';
import { message } from 'antd';
export const UserContext = React.createContext();

const userListReducer = (state, { type, payload }) => {
  switch (type) {
    case 'INIT':
      return payload;
    case 'ADD':
      return [payload, ...state];
    case 'UPDATE':
      const updated = state.map(user => {
        if (user._id === payload._id) {
          return payload
        }
        return user;
      });
      return updated;
    default:
      return state;
  }
}

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userList, dispatchUserListAction] = useReducer(userListReducer, null);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await Axios.get(`${process.env.REACT_APP_API_URL}/users`);
        dispatchUserListAction({ type: 'INIT', payload: data })
      } catch (e) {
        message.error(e.message, 3)
      }
    })()
  }, [])
  useEffect(() => {
    if (userList && user) {
      // update the currently set user
      setUser(userList.find(({_id})=> _id === user._id))
    }
  }, [userList, user, setUser])
  return (
    <UserContext.Provider value={{ user, setUser, userList, dispatchUserListAction }}>{children}</UserContext.Provider>
  )
}

export default UserProvider
