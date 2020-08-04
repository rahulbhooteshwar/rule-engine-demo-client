import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Button, Typography, message, Skeleton, Tag, Input, Spin } from 'antd'
import { PlusOutlined, SettingOutlined, EditOutlined } from '@ant-design/icons'
import Axios from 'axios';
import Avatar from 'antd/lib/avatar/avatar';
import { useHistory } from 'react-router-dom';
import Modal from 'antd/lib/modal/Modal';
const { Title } = Typography;
const Contents = () => {
  const history = useHistory();
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [contents, setContents] = useState();
  const [contentTitle, setContentTitle] = useState();
  const [currentContent, setCurrentContent] = useState();
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await Axios.get(`${process.env.REACT_APP_API_URL}/contents`);
        setContents(data)
      } catch (e) {
        message.error(e.message, 3)
      }
    })()
  }, []);
  const handleCreate = async () => {
    if (contentTitle) {
      setSubmitting(true)
      try {
        const { data } = await Axios.post(`${process.env.REACT_APP_API_URL}/contents`, { title: contentTitle });
        setContents([data, ...contents])
        setShowCreateModal(false)
        setSubmitting(false)
        setContentTitle(null)
      } catch (e) {
        message.error(e.message, 3)
        setSubmitting(false)
      }
    }
  }
  const handleUpdate = async () => {
    if (currentContent && currentContent.title) {

      setSubmitting(true)
      try {
        const { data } = await Axios.put(`${process.env.REACT_APP_API_URL}/contents/${currentContent._id}`, { title: currentContent.title });
        const updated = contents.map(content => {
          if (content._id === data._id) {
            return data;
          }
          return content
        })
        setContents(updated)
        setShowUpdateModal(false)
        setSubmitting(false)
        setCurrentContent(null)
      } catch (e) {
        message.error(e.message, 3)
        setSubmitting(false)
      }
    }
  }
  return (
    <>
      <Row>
        <Col flex="1" style={{ padding: 25, background: '#ececec' }}>
          <Title type="primary" level={1} strong>Contents</Title>
          <br />
          <Button size="large" type="primary" onClick={() => setShowCreateModal(true)}>
            <PlusOutlined /> Create Content
          </Button>
          <Row style={{ marginTop: 20 }}>
            {
              contents
                ? contents.map(
                  item => <Col span={8} key={item._id}>
                    <Card
                      style={{ width: 500, marginTop: 16 }}
                      actions={[
                        <><SettingOutlined key="rules" onClick={() => history.push(`/contents/${item._id}`)} /> Rules</>,
                        <><EditOutlined key="edit" onClick={() => { setCurrentContent(item); setShowUpdateModal(true) }} />Edit</>
                      ]}
                    >
                      <Avatar shape="circle" size={100} src={item.image} />
                      <h2 style={{ display: 'inline-block' }}>
                        {item.title}
                        <br />
                        {
                          item.rules && item.rules.length > 0
                            ? <Tag color="green"><strong>Rules Applied</strong></Tag>
                            : <Tag color="red"><strong>No Rules</strong></Tag>
                        }
                      </h2>
                    </Card>
                  </Col>
                )
                : <>
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                </>
            }
          </Row>
        </Col>
      </Row>
      <Modal
        title="Create Content"
        visible={showCreateModal}
        okText='Create'
        onOk={handleCreate}
        onCancel={() => setShowCreateModal(false)}
      >
        <Spin size="large" spinning={submitting}>
          <Input placeholder="Content Title"
            value={contentTitle}
            onChange={e => setContentTitle(e.target.value)}
          />
        </Spin>
      </Modal>
      <Modal
        title="Update Content"
        visible={showUpdateModal}
        onOk={handleUpdate}
        okText='Update'
        onCancel={() => setShowUpdateModal(false)}
      >
        <Spin size="large" spinning={submitting}>
          {
            currentContent
              ? <Input placeholder="Content Title"
                value={currentContent.title}
                onChange={e => { setCurrentContent({ ...currentContent, title: e.target.value }) }}
              />
              : ''
          }
        </Spin>
      </Modal>
    </>
  )
}

export default Contents
