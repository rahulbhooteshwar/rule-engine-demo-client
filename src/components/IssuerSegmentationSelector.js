import React, { useEffect, useState } from 'react'
import { Select, Typography } from 'antd';
import Axios from 'axios';
const { Option } = Select;
const { Text } = Typography;

const IssuerSegmentationSelector = ({ region, issuerSegmentation, setIssuerSegmentation }) => {
  const [issuerSegmentations, setIssuerSegmentations] = useState([]);
  useEffect(() => {
    if (region) {
      setIssuerSegmentations([]);
      (async () => {
        const { data } = await Axios.get(`${process.env.REACT_APP_API_URL}/issuer-segmentations?region=${region}`);
        setIssuerSegmentations(data);
        const match = data.find(item => item._id === issuerSegmentation)
        if (!match) {
          setIssuerSegmentation(null);
        }
      })()
    } else {
      setIssuerSegmentations([]);
    }
  }, [region, setIssuerSegmentation])
  return (
    <>
      <Text type="primary" strong>Issuer Segmentation</Text>
      <br />
      <Select value={issuerSegmentation} size='large' style={{ width: '100%' }} onChange={setIssuerSegmentation} loading={!issuerSegmentations.length}>
        <Option value={null}>Select IssuerSegmentation</Option>
        {
          issuerSegmentations && issuerSegmentations.map(
            item => <Option key={item._id} value={item._id}>{item.title}</Option>
          )
        }
      </Select>
      <br/>
    </>
  )
}

export default IssuerSegmentationSelector
