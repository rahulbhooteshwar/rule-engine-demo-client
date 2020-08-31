import React, { useState } from 'react'
import { List, Row, Switch, Col, Card, message, Skeleton, Spin, Typography, Divider, Result, Button, Space, PageHeader, Radio } from 'antd'
import RuleList from '../components/RuleList'
import { useParams, useHistory } from 'react-router';
import Avatar from 'antd/lib/avatar/avatar';
import { DeleteOutlined, FundViewOutlined } from '@ant-design/icons'
import RegionSelector from '../components/RegionSelector';
import { useQuery, useMutation, queryCache } from 'react-query';
const { Title, Text } = Typography
const fetchContent = async (_key, _id) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/contents/${_id}`)
  return response.json()
}
const updateContentMutation = async ({ _id, data }) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/contents/${_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response;
}
const ConfigureContentRules = () => {
  const history = useHistory();
  const { _id } = useParams();
  const { data: content, status } = useQuery(['getContent', _id], fetchContent, {enabled:_id})
  const [updateContent] = useMutation(updateContentMutation, {
    onSuccess: async () => {
      message.success('Content Updated Successfully', 3)
      await queryCache.invalidateQueries(['getContent', _id])
      setUpdatingRules(false)
    }
  })
  const [updatingRules, setUpdatingRules] = useState(false);
  const [search, setSearch] = useState();
  const [region, setRegion] = useState('5f22f961ab69d5439029b3e8');
  const [lazy, setLazy] = useState(true)
  const onRuleSelect = async (newRuleId) => {
    // get current rule list , add this rule to that & update the content with it
    const ruleIds = content.rules.map(({ _id }) => _id)
    if (ruleIds.indexOf(newRuleId) === -1) {
      setUpdatingRules(true)
      ruleIds.push(newRuleId)
      updateContent({_id, data: {rules: ruleIds}})
    } else {
      message.warn('The rule you are trying to apply, is already applied to this content', 5)
    }
  }
  const onRuleRemove = async (ruleToRemove) => {
    setUpdatingRules(true)
    let ruleIds = content.rules.map(({ _id }) => _id)
    ruleIds = ruleIds.filter(_id => _id !== ruleToRemove)
    updateContent({_id, data: {rules: ruleIds}})
  }
  const updateRuleMatchType = async (ruleMatchType) => {
    setUpdatingRules(true)
    updateContent({_id, data: { ruleMatchType }})
  }
  return (
    <>
      <PageHeader
        className="site-page-header"
        onBack={() => history.push('/contents')}
        title="Back"
        subTitle="Manage rules associated with content"
        extra={
          (
            <div style={{width: 200}}>
              Currently Managing:  <RegionSelector {...{ region, setRegion }} />
            </div>
          )
        }
      >
      </PageHeader>

      <Row>
        <Col span={12}>
          <Card title="Content Details" bordered style={{ width: '100%', minHeight: '80vh' }}>
            <Spin size="large" spinning={status === 'loading'}>
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
            <Switch checkedChildren="Search Only" unCheckedChildren="Show All" onChange={() => setLazy(!lazy) && setSearch(null)} />
            <div style={{ height: '90vh', overflowY: 'auto' }}>
              <RuleList search={search} region={region} lazy={lazy} clickAction={onRuleSelect}></RuleList>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default ConfigureContentRules
