import React, { useEffect } from 'react'
import { Select, Typography } from 'antd';
import { useQuery } from 'react-query';
const { Option } = Select;
const { Text } = Typography;
const fetchMarkets = async (_key, region) => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/markets?region=${region}`)
  return res.json()
}
const MarketSelector = ({ region, market, setMarket }) => {
  const {data: markets, status} = useQuery(['markets', region], fetchMarkets, {enabled: region})
  useEffect(() => {
    if (markets) {
      const match = markets.find(item => item._id === market)
      if (!match) {
        setMarket(null);
      }
    } else {
      if (status !== 'loading') {
        setMarket(null);
      }
    }
  }, [markets, market, setMarket, status])
  return (
    <>
      <Text type="primary" strong>Market</Text>
      <br />
      <Select value={market} size='large' style={{ width: '100%' }} onChange={setMarket} loading={!markets}>
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
