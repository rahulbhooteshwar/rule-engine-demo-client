import React, { useEffect, useState } from 'react'
import { Select, Typography } from 'antd';
import Axios from 'axios';
const { Option } = Select;
const { Text } = Typography;
const RegionSelector = ({ region, setRegion }) => {
  const [regions, setRegions] = useState([]);
  useEffect(() => {
    (async () => {
      const { data } = await Axios.get(`${process.env.REACT_APP_API_URL}/regions`);
      setRegions(data);
    })()
  }, [])
  return (
    <>
      <Text type="primary" strong>Region</Text>
      <br />
      <Select value={region} size='large' style={{ width: '100%' }} onChange={setRegion} loading={!regions.length}>
        <Option value={null}>Select Region</Option>
        {
          regions && regions.map(
            item => <Option key={item._id} value={item._id}>{item.title}</Option>
          )
        }
      </Select>
      <br/>
    </>
  )
}

export default RegionSelector
