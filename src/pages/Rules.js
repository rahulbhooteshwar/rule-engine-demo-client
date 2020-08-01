import React from 'react'
import { Row, Col, Typography, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router';
import RuleList from '../components/RuleList';
const { Title } = Typography;

const Rules = () => {
  const history = useHistory()
  return (
    <>
      <Row>
        <Col flex="1" style={{ padding: 25, background: '#ececec' }}>
          <Title type="primary" level={1} strong>Rules</Title>
          <br />
          <Button size="large" type="primary" onClick={() => history.push('/rules/create')}>
            <PlusOutlined /> Create Rule
          </Button>
          <RuleList></RuleList>
        </Col>
      </Row>
    </>
  )
}

export default Rules
