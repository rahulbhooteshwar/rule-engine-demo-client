import React from 'react'

import RegionSelector from './RegionSelector';
import CountrySelector from './CountrySelector';
import MarketSelector from './MarketSelector';
import IssuerSegmentationSelector from './IssuerSegmentationSelector';
import LangSelector from './LangSelector';
import { Input, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

const CreateUpdateUserForm = (props) => {
  const {
    name, setName,
    region, setRegion,
    country, setCountry,
    market, setMarket,
    issuerSegmentation, setIssuerSegmentation,
    lang, setLang
  } = props
  return (
    <>
      <Text type="primary" strong>Name</Text>
      <br />
      <Input style={{ width: '100%' }} value={name} onChange={e => setName(e.target.value)} size="large" placeholder="Enter Name" prefix={<UserOutlined />} />
      <br />
      <RegionSelector {...{ region, setRegion }} />
      <MarketSelector {...{ region, market, setMarket }} />
      <IssuerSegmentationSelector {...{ region, issuerSegmentation, setIssuerSegmentation }} />
      <CountrySelector {...{ region, country, setCountry }} />
      <LangSelector {...{ country, lang, setLang }} />
    </>
  )
}

export default CreateUpdateUserForm
