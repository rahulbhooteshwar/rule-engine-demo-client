import React, { useEffect } from 'react'
import { Select, Typography } from 'antd';
import { useQuery } from 'react-query';
const { Option } = Select;
const { Text } = Typography;

const fetchSegments = async (_key, region) => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/issuer-segmentations?region=${region}`)
  return res.json()
}
const IssuerSegmentationSelector = ({ region, issuerSegmentation, setIssuerSegmentation }) => {
  const {data: issuerSegmentations, status} = useQuery(['issuerSegmentations', region], fetchSegments, {enabled: region})
  useEffect(() => {
    if (issuerSegmentations) {
      const match = issuerSegmentations.find(item => item._id === issuerSegmentation)
      if (!match) {
        setIssuerSegmentation(null);
      }
    } else {
      if (status !== 'loading') {
        setIssuerSegmentation(null);
      }
    }
  }, [issuerSegmentations, issuerSegmentation, setIssuerSegmentation, status])
  return (
    <>
      <Text type="primary" strong>Issuer Segmentation</Text>
      <br />
      <Select value={issuerSegmentation} size='large' style={{ width: '100%' }} onChange={setIssuerSegmentation} loading={!issuerSegmentations}>
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
