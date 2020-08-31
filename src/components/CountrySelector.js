import React, { useEffect } from 'react'
import { Select, Typography } from 'antd';
import { useQuery } from 'react-query';
const { Option } = Select;
const { Text } = Typography;
const fetchCountries = async (_key, region) => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/countries?region=${region}`)
  return res.json()
}
const CountrySelector = ({ region, country, setCountry }) => {
  const {data: countries, status} = useQuery(['countries', region], fetchCountries, {enabled: region})
  useEffect(() => {
    if (countries) {
      const match = countries.find(item => item._id === country)
      if (!match) {
        setCountry(null);
      }
    } else {
      if (status !== 'loading') {
        setCountry(null);
      }
    }
  }, [countries, country, setCountry, status])
  return (
    <>
      <Text type="primary" strong>Country</Text>
      <br />
      <Select value={country} size='large' style={{ width: '100%' }} onChange={setCountry} loading={!countries}>
        <Option value={null}>Select Country</Option>
        {
          countries && countries.map(
            item => <Option key={item._id} value={item._id}>{item.title}</Option>
          )
        }
      </Select>
      <br/>
    </>
  )
}

export default CountrySelector
