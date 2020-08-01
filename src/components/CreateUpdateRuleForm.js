import React from 'react'
import { Skeleton, Typography, Input, Select, Radio } from 'antd';
const { Text } = Typography;
const { Option } = Select;

const CreateUpdateRuleForm = ({
  loading,
  data,
  filteredData,
  title, setTitle,
  matchType, setMatchType,
  selectedRegions, setSelectedRegiions,
  selectedMarkets, setSelectedMarkets,
  selectedCountries, setSelectedCountries,
  selectedLanguages, setSelectedLanguages,
  selectedIssuerSegmentations, setSelectedIssuerSegmentations,
}) => {

  return (
    <>
      {
        loading
          ? <Skeleton active paragraph={{ rows: 12 }} />
          : ''
      }
      {data
        ? <>
          <Text type="primary" strong>Title</Text>
          <Input style={{ width: '100%' }} value={title} onChange={e => setTitle(e.target.value)} size="large" placeholder="Enter Title" />
          <br />
          <Text type="primary" strong>Available in Regions</Text>
          <Select
            value={selectedRegions}
            onChange={regions => setSelectedRegiions(regions)}
            mode="multiple"
            size="large"
            filterOption
            optionFilterProp="label"
            placeholder="Select Regions"
            style={{ width: '100%' }}
            optionLabelProp="label"
          >
            {
              data.regions.map(item => {
                return <Option key={item._id} value={item._id} label={item.title}>{item.title}</Option>
              })
            }
          </Select>
          <h3 style={{marginTop: "10px"}}>Configure Conditions</h3>
          <Text type="primary" strong>Match Type</Text>
          <br />
          <Radio.Group
            options={[{ label: 'Match All', value: 'ALL' }, { label: 'Match Any', value: 'ANY' }]}
            onChange={e=> setMatchType(e.target.value)}
            value={matchType}
            optionType="button"
            buttonStyle="solid"
          />
          <br />
          <Text type="primary" strong>Markets</Text>
          <Select
            value={selectedMarkets}
            onChange={(markets) => setSelectedMarkets(markets)}
            mode="multiple"
            filterOption
            optionFilterProp="label"
            size="large"
            placeholder="Select Markets"
            style={{ width: '100%' }}
            optionLabelProp="label"
          >
            {
              filteredData && filteredData.markets && filteredData.markets.map(item => {
                return <Option key={item._id} value={item._id} label={item.title}>{item.title}</Option>
              })
            }
          </Select>
          <Text type="primary" strong>Issuer Segmentations</Text>
          <Select
            value={selectedIssuerSegmentations}
            onChange={values => setSelectedIssuerSegmentations(values)}
            mode="multiple"
            size="large"
            placeholder="Select Segmentations"
            style={{ width: '100%' }}
            filterOption
            optionFilterProp="label"
            optionLabelProp="label"
          >
            {
              filteredData && filteredData.issuerSegmentations && filteredData.issuerSegmentations.map(item => {
                return <Option key={item._id} value={item._id} label={item.title}>{item.title}</Option>
              })
            }
          </Select>
          <Text type="primary" strong>Countries</Text>
          <Select
            mode="multiple"
            size="large"
            placeholder="Select Countries"
            style={{ width: '100%' }}
            value={selectedCountries}
            onChange={countries => setSelectedCountries(countries)}
            filterOption
            optionFilterProp="label"
            optionLabelProp="label"
          >
            {
              filteredData && filteredData.countries && filteredData.countries.map(item => {
                return <Option key={item._id} value={item._id} label={item.title}>{item.title}</Option>
              })
            }
          </Select>
          <Text type="primary" strong>Languages</Text>
          <Select
            value={selectedLanguages}
            onChange={languages => setSelectedLanguages(languages)}
            mode="multiple"
            size="large"
            placeholder="Select Languages"
            style={{ width: '100%' }}
            optionLabelProp="label"
            filterOption
            optionFilterProp="label"
          >
            {
              filteredData && filteredData.languages && filteredData.languages.map(item => {
                return <Option key={item._id} value={item._id} label={item.title}>{item.title}</Option>
              })
            }
          </Select>
        </>
        : ''
      }
    </>
  )
}

export default CreateUpdateRuleForm
