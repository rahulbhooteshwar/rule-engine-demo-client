/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react'
import { Select, Typography } from 'antd';
import Axios from 'axios';
const { Option } = Select;
const { Text } = Typography;

const CountrySelector = ({ region, country, setCountry }) => {
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    if (region) {
      setCountries([]);
      (async () => {
        const { data } = await Axios.get(`${process.env.REACT_APP_API_URL}/countries?region=${region}`);
        setCountries(data);
        const match = data.find(item => item._id === country)
        if (!match) {
          setCountry(null);
        }
      })()
    } else {
      setCountries([]);
    }
  }, [region, setCountry])
  return (
    <>
      <Text type="primary" strong>Country</Text>
      <br />
      <Select value={country} size='large' style={{ width: '100%' }} onChange={setCountry} loading={!countries.length}>
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
