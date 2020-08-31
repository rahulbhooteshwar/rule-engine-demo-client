import React, { useState } from 'react'
import { Row, Col, Card, Button, Typography, message, Skeleton, Tag, Input, Spin } from 'antd'
import { PlusOutlined, SettingOutlined, EditOutlined } from '@ant-design/icons'
import Avatar from 'antd/lib/avatar/avatar';
import { useHistory } from 'react-router-dom';
import Modal from 'antd/lib/modal/Modal';
import { useQuery, useMutation, queryCache } from 'react-query';
const { Title } = Typography;
const fetchContents = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/contents`)
  return response.json()
}
const addContentMutation = async (content) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/contents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(content)
  });
  return response.json();
}
const updateContentMutation = async ({_id, title}) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/contents/${_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({title})
  });
  return response.json();
}
const Contents = () => {
  const history = useHistory();
  const {data: contents} = useQuery('contents', fetchContents)
  const [addContent] = useMutation(addContentMutation, {
    onSuccess: async () => {
      message.success('Content Created Successfully', 3)
      await queryCache.invalidateQueries('contents')
    },
  })
  const [updateContent] = useMutation(updateContentMutation, {
    onSuccess: async () => {
      message.success('Content Updated Successfully', 3)
      await queryCache.invalidateQueries('contents')
    },
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [contentTitle, setContentTitle] = useState();
  const [currentContent, setCurrentContent] = useState();
  const [submitting, setSubmitting] = useState(false);
  const handleCreate = async () => {
    if (contentTitle) {
      setSubmitting(true)
      try {
        await addContent({ title: contentTitle })
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
        await updateContent(currentContent)
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
