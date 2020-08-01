import React, { useState, useEffect } from 'react'
import { List, Row, Col, Card, message, Skeleton, Spin, Typography, Divider, Result, Button, Space, PageHeader, Radio } from 'antd'
import RuleList from '../components/RuleList'
import { useParams, useHistory } from 'react-router';
import Axios from 'axios';
import Avatar from 'antd/lib/avatar/avatar';
import { DeleteOutlined, FundViewOutlined } from '@ant-design/icons'
const { Title, Text } = Typography
const ConfigureContentRules = () => {
  const history = useHistory();
  const { _id } = useParams();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState();
  const [updatingRules, setUpdatingRules] = useState(false);
  const [search, setSearch] = useState();
  const onRuleSelect = async (newRuleId) => {
    // get current rule list , add this rule to that & update the content with it
    const ruleIds = content.rules.map(({ _id }) => _id)
    if (ruleIds.indexOf(newRuleId) === -1) {
      setUpdatingRules(true)
      ruleIds.push(newRuleId)
      try {
        const { data } = await Axios.put(`${process.env.REACT_APP_API_URL}/contents/${_id}`, { rules: ruleIds });
        setContent(data);
        setUpdatingRules(false)
      } catch (e) {
        message.error(e.message)
        setUpdatingRules(false)
      }
    } else {
      message.warn('The rule you are trying to apply, is already applied to this content', 5)
    }
  }
  const onRuleRemove = async (ruleToRemove) => {
    setUpdatingRules(true)
    let ruleIds = content.rules.map(({ _id }) => _id)
    ruleIds = ruleIds.filter(_id => _id !== ruleToRemove)
    try {
      const { data } = await Axios.put(`${process.env.REACT_APP_API_URL}/contents/${_id}`, { rules: ruleIds });
      setContent(data);
      setUpdatingRules(false)
    } catch (e) {
      message.error(e.message)
      setUpdatingRules(false)
    }
  }
  const updateRuleMatchType = async (ruleMatchType) => {
    setUpdatingRules(true)
    try {
      const { data } = await Axios.put(`${process.env.REACT_APP_API_URL}/contents/${_id}`, { ruleMatchType });
      setContent(data);
      setUpdatingRules(false)
      message.success(`Updated: ${ruleMatchType} rule(s) will be matched during content targetting for users!`)
    } catch (e) {
      message.error(e.message)
      setUpdatingRules(false)
    }
  }
  useEffect(() => {
    if (_id) {
      setLoading(true)
      try {
        (async () => {
          const { data } = await Axios.get(`${process.env.REACT_APP_API_URL}/contents/${_id}`);
          setContent(data)
          setLoading(false)
        })()
      } catch (e) {
        message.error(e.message)
        setLoading(false)
      }
    }
  }, [_id])
  return (
    <>
      <PageHeader
        className="site-page-header"
        onBack={() => history.push('/contents')}
        title="Back"
        subTitle="Manage rules associated with content"
      />

      <Row>
        <Col span={12}>
          <Card title="Content Details" bordered style={{ width: '100%', minHeight: '80vh' }}>
            <Spin size="large" spinning={loading}>
              {
                content ?
                  <>
                    <Row>
                      <Col span="6">
                        <Avatar shape="circle" size={50} src={content.image} />
                      </Col>
                      <Col span="18">
                        <Title level={4} style={{ marginTop: 20 }}>{content.title}</Title>
                      </Col>
                    </Row>
                    <Divider orientation="left">Rules</Divider>
                    {
                      updatingRules
                        ? <Skeleton active paragraph={{ rows: 20 }}></Skeleton>
                        : content.rules && content.rules.length > 0
                          ? <>
                            <Text type="primary" strong>Match Type</Text>
                            <br />
                            <Radio.Group
                              options={[{ label: 'Match All', value: 'ALL' }, { label: 'Match Any', value: 'ANY' }]}
                              onChange={e => updateRuleMatchType(e.target.value)}
                              value={content.ruleMatchType}
                              optionType="button"
                              buttonStyle="solid"
                            />
                            <br />
                            <List
                              size="large"
                              bordered
                              dataSource={content.rules}
                              renderItem={
                                item => <List.Item>
                                  <Text>{item.title}</Text>
                                  <Space>
                                    <Button onClick={() => onRuleRemove(item._id)} title="Remove Rule" type="danger" shape="circle" icon={<DeleteOutlined />} />
                                    <Button onClick={() => setSearch(item.title)} type="primary" icon={<FundViewOutlined />}>View Dteails</Button>
                                  </Space>
                                </List.Item>
                              }
                            />
                          </>
                          : <Result
                            status="404"
                            title="No Rules Applied"
                            subTitle="Search rules from sidebar & click to apply"
                            extra={<Title level={4}>This content is visible to all by default!</Title>}
                          />
                    }
                  </>
                  : ''
              }
            </Spin>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Search & Apply Rules" bordered style={{ width: '100%', minHeight: '80vh' }}>
            <div style={{ height: '90vh', overflowY: 'auto' }}>
              <RuleList search={search} lazy clickAction={onRuleSelect}></RuleList>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default ConfigureContentRules
