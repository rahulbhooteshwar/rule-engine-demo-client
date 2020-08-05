import React, { useEffect, useState, useContext } from 'react'
import { useParams, useHistory } from 'react-router'
import Axios from 'axios'
import { message, Row, Col, Card, Skeleton, Button, Space, Spin, PageHeader } from 'antd'
import CreateUpdateUserForm from '../components/CreateUpdateUserForm'
import { UserContext } from '../context/UserContext'

const CreateUpdateUser = () => {
  const { dispatchUserListAction } = useContext(UserContext)
  const history = useHistory();
  const { _id } = useParams()
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState(null);
  const [region, setRegion] = useState(null);
  const [country, setCountry] = useState(null);
  const [lang, setLang] = useState(null);
  const [market, setMarket] = useState(null);
  const [issuerSegmentation, setIssuerSegmentation] = useState(null);

  useEffect(() => {
    if (_id) {
      (async () => {
        setLoading(true);
        try {
          const { data } = await Axios.get(`${process.env.REACT_APP_API_URL}/users/${_id}`);
          init(data)
        } catch (e) {
          message.error(e.message, 3)
          setLoading(false)
        }
      })()
    }
  }, [_id])
  const init = (user) => {
    setName(user.name)
    setRegion(user.region._id)
    setMarket(user.market._id)
    setIssuerSegmentation(user.issuerSegmentation._id)
    setCountry(user.country._id)
    setLang(user.lang._id)
    setLoading(false)
  }
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (_id) {
        const { data } = await Axios.put(`${process.env.REACT_APP_API_URL}/users/${_id}`, { name, region, country, lang: lang, market, issuerSegmentation });
        dispatchUserListAction({ type: 'UPDATE', payload: data });
      } else {
        const { data } = await Axios.post(`${process.env.REACT_APP_API_URL}/users`, { name, region, country, lang: lang, market, issuerSegmentation });
        dispatchUserListAction({ type: 'ADD', payload: data });
        message.success('User Created Successfully', 3)
      }
      history.push('/users')
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
