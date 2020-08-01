import React, { useEffect, useState } from 'react'
import { Select, Typography } from 'antd';
import Axios from 'axios';
const { Option } = Select;
const { Text } = Typography;

const MarketSelector = ({ region, market, setMarket }) => {
  const [markets, setMarkets] = useState([]);
  useEffect(() => {
    if (region) {
      setMarkets([]);
      (async () => {
        const { data } = await Axios.get(`${process.env.REACT_APP_API_URL}/markets?region=${region}`);
        setMarkets(data);
        const match = data.find(item => item._id === market)
        if (!match) {
          setMarket(null);
        }
      })()
    } else {
      setMarkets([]);
    }
  }, [region, setMarket])
  return (
    <>
      <Text type="primary" strong>Market</Text>
      <br />
      <Select value={market} size='large' style={{ width: '100%' }} onChange={setMarket} loading={!markets.length}>
        <Option value={null}>Select Market</Option>
        {
          markets && markets.map(
            item => <Option key={item._id} value={item._id}>{item.title}</Option>
          )
        }
      </Select>
      <br/>
    </>
  )
}

export default MarketSelector
