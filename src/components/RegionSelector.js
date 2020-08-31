import React from 'react'
import { Select, Typography } from 'antd';
import { useQuery } from 'react-query';
const { Option } = Select;
const { Text } = Typography;
const fetchRegions = async () => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/regions`)
  return res.json()
}
const RegionSelector = ({ region, setRegion }) => {
  const {data: regions} = useQuery('regions', fetchRegions)
  return (
    <>
      <Text type="primary" strong>Region</Text>
      <br />
      <Select value={region} size='large' style={{ width: '100%' }} onChange={setRegion} loading={!regions}>
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
