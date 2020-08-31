import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router'
import { message, Row, Col, Card, Skeleton, Button, Space, Spin, PageHeader } from 'antd'
import CreateUpdateUserForm from '../components/CreateUpdateUserForm'
import { useMutation, queryCache, useQuery } from 'react-query'
const addUserMutation = async (user) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  return response.json();
}
const updateUserMutation = async ({ _id, user }) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  return response;
}
const fetchUser = async (_key, _id) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${_id}`);
  return response.json();
}
const CreateUpdateUser = () => {
  const { _id } = useParams()
  const { data: user } = useQuery(['getUser', _id], fetchUser, { enabled: _id })
  const [addUser] = useMutation(addUserMutation, {
    onSuccess: async () => {
      message.success('User Created Successfully', 3)
      await queryCache.invalidateQueries('userList')
      setSubmitting(false)
      history.push('/users')
    },
  })
  const [updateUser] = useMutation(updateUserMutation, {
    onSuccess: async () => {
      message.success('User Updated Successfully', 3)
      await queryCache.invalidateQueries('userList')
      setSubmitting(false)
      history.push('/users')
    },
  })
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState(null);
  const [region, setRegion] = useState(null);
  const [country, setCountry] = useState(null);
  const [lang, setLang] = useState(null);
  const [market, setMarket] = useState(null);
  const [issuerSegmentation, setIssuerSegmentation] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name)
      setRegion(user.region._id)
      setMarket(user.market._id)
      setIssuerSegmentation(user.issuerSegmentation._id)
      setCountry(user.country._id)
      setLang(user.lang._id)
      setLoading(false)
    }
  }, [user])
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (_id) {
        await updateUser({ _id, user: { name, region, country, lang: lang, market, issuerSegmentation } })
      } else {
        await addUser({ name, region, country, lang: lang, market, issuerSegmentation })
      }
    } catch (e) {
      message.error(e.message, 3)
      setSubmitting(false)
    }
  }
  return (
    <>
      <PageHeader
        className="site-page-header"
        onBack={() => history.push('/users')}
        title="Users"
      />
      <Row>
        <Col span={8} />
        <Col span={8}>
          <Card bordered>
            <h2>{_id ? 'Update User' : 'Create User'}</h2>
            {!loading
              ? <>
                <Spin size="large" spinning={submitting}>
                  <CreateUpdateUserForm {
                    ...{
                      name, setName,
                      region, setRegion,
                      country, setCountry,
                      market, setMarket,
                      issuerSegmentation, setIssuerSegmentation,
                      lang, setLang
                    }
                  } />
                  <Space style={{ float: 'left' }}>
                    <Button onClick={() => { history.push('/users') }} size="large" >Cancel</Button>
                  </Space>
                  <Space style={{ float: 'right' }}>
                    <Button disabled={!name || !region || !country || !market || !issuerSegmentation || !lang} onClick={handleSubmit} size="large" type="primary">{_id ? 'Update' : 'Create'}</Button>
                  </Space>
                </Spin>
              </>
              : <Skeleton active paragraph={{ rows: 10 }} />
            }
          </Card>
        </Col>
        <Col span={8} />
      </Row>
    </>
  )
}

export default CreateUpdateUser
