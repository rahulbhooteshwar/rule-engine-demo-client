/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { message, Row, Col, Card, Space, Button, Spin, PageHeader } from 'antd';
import CreateUpdateRuleForm from '../components/CreateUpdateRuleForm';
import { useHistory, useParams } from 'react-router';

const CreateUpdateRule = () => {
  const history = useHistory()
  const { _id } = useParams()
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState({});
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedMarkets, setSelectedMarkets] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedIssuerSegmentations, setSelectedIssuerSegmentations] = useState([]);
  const [title, setTitle] = useState();
  const [matchType, setMatchType] = useState('ALL');
  const init = async () => {
    setLoading(true);
    try {
      const { data: regions } = await Axios.get(`${process.env.REACT_APP_API_URL}/regions`);
      const { data: markets } = await Axios.get(`${process.env.REACT_APP_API_URL}/markets`);
      const { data: issuerSegmentations } = await Axios.get(`${process.env.REACT_APP_API_URL}/issuer-segmentations`);
      const { data: countries } = await Axios.get(`${process.env.REACT_APP_API_URL}/countries`);
      const { data: languages } = await Axios.get(`${process.env.REACT_APP_API_URL}/languages`);
      setData({ regions, markets, issuerSegmentations, countries, languages })
      if (_id) {
        initFormData()
      }
      setLoading(false)
    } catch (e) {
      setLoading(false)
      message.error(e.message, 3)
    }

  }
  const initFormData = async () => {
    const { data: rule } = await Axios.get(`${process.env.REACT_APP_API_URL}/rules/${_id}`);
    setTitle(rule.title);
    setMatchType(rule.conditionMatchType);
    const langCondition = rule.conditions.find(condition => condition.attribute === 'lang')
    if (langCondition) {
      setSelectedLanguages(langCondition.inValues)
    }
    const marketCondition = rule.conditions.find(condition => condition.attribute === 'market')
    if (marketCondition) {
      setSelectedMarkets(marketCondition.inValues)
    }
    const segCondition = rule.conditions.find(condition => condition.attribute === 'issuerSegmentation')
    if (segCondition) {
      setSelectedIssuerSegmentations(segCondition.inValues)
    }
    const countryCondition = rule.conditions.find(condition => condition.attribute === 'country')
    if (countryCondition) {
      setSelectedCountries(countryCondition.inValues)
    }
    setSelectedRegions(rule.regions);
  }
  const onRegionSelect = () => {
    if (data) {
      const markets = data.markets.filter(({ region }) => selectedRegions.indexOf(region) !== -1)
      const issuerSegmentations = data.issuerSegmentations.filter(({ region }) => selectedRegions.indexOf(region) !== -1)
      const countries = data.countries.filter(({ region }) => selectedRegions.indexOf(region) !== -1)
      // clear selected data for dependent fields
      setSelectedMarkets(selectedMarkets.filter(value => {
        const target = data.markets.find(item => item._id === value)
        return selectedRegions.indexOf(target.region) !== -1
      }))
      setSelectedIssuerSegmentations(selectedIssuerSegmentations.filter(
        value => {
          const target = data.issuerSegmentations.find(item => item._id === value)
          return selectedRegions.indexOf(target.region) !== -1
        }
      ))
      setSelectedCountries(selectedCountries.filter(
        value => {
          const target = data.countries.find(item => item._id === value)
          return selectedRegions.indexOf(target.region) !== -1
        }
      ))
      // following data will be used for showing filtered data in select options
      setFilteredData({ markets, issuerSegmentations, countries })
    }
  }
  const onCountrySelect = () => {
    if (data) {
      // clear selected data for dependent fields
      setSelectedLanguages(selectedLanguages.filter(
        value => {
          const target = data.languages.find(item => item._id === value)
          return selectedCountries.indexOf(target.country) !== -1
        }
      ))
      // filter languages to show in options
      const languages = data.languages.filter(({ country }) => selectedCountries.indexOf(country) !== -1)
      setFilteredData({ ...filteredData, languages })
    }
  }
  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (selectedRegions) {
      onRegionSelect()
    }
  }, [selectedRegions])

  useEffect(() => {
    if (selectedCountries) {
      onCountrySelect()
    }
  }, [selectedCountries])

  const handleSubmit = async () => {
    setSubmitting(true)
    const body = {
      title,
      regions: selectedRegions,
      conditionMatchType: matchType,
      conditions: []
    }
    if (selectedMarkets && selectedMarkets.length > 0) {
      body.conditions.push({
        attribute: 'market',
        inValues: selectedMarkets
      })
    }
    if (selectedCountries && selectedCountries.length > 0) {
      body.conditions.push({
        attribute: 'country',
        inValues: selectedCountries
      })
    }
    if (selectedLanguages && selectedLanguages.length > 0) {
      body.conditions.push({
        attribute: 'lang',
        inValues: selectedLanguages
      })
    }
    if (selectedIssuerSegmentations && selectedIssuerSegmentations.length > 0) {
      body.conditions.push({
        attribute: 'issuerSegmentation',
        inValues: selectedIssuerSegmentations
      })
    }
    if (!body.conditions || body.conditions.length === 0) {
      message.error('Rules without conditions have no significance!', 3);
      setSubmitting(false)
      return
    }
    try {
      if (_id) {
        await Axios.put(`${process.env.REACT_APP_API_URL}/rules/${_id}`, body);
        message.success('Rule Updated Successfully', 3)
        history.push('/rules')
      } else {
        await Axios.post(`${process.env.REACT_APP_API_URL}/rules`, body);
        message.success('Rule Created Successfully', 3)
        history.push('/rules')
      }
    } catch (e) {
      message.error(e.message, 3)
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader
        className="site-page-header"
        onBack={() => history.push('/rules')}
        title="Back to Rules"
        subTitle="Manage rules associated with content"
      />

      <Row>
        <Col flex="1"></Col>
        <Col flex="1">
          <Card bordered>
            <h2>{_id ? 'Update Rule' : 'Create Rule'}</h2>
            <Spin size="large" spinning={submitting}>
              <CreateUpdateRuleForm {...{
                loading, setLoading,
                data, setData,
                filteredData, setFilteredData,
                selectedRegions, setSelectedRegions,
                selectedMarkets, setSelectedMarkets,
                selectedCountries, setSelectedCountries,
                selectedLanguages, setSelectedLanguages,
                selectedIssuerSegmentations, setSelectedIssuerSegmentations,
                title, setTitle,
                matchType, setMatchType
              }} />
              <Space style={{ float: 'left', marginTop: '25px' }}>
                <Button onClick={() => { history.push('/rules') }} size="large" >Cancel</Button>
              </Space>
              <Space style={{ float: 'right', marginTop: '25px' }}>
                <Button disabled={!(selectedRegions && selectedRegions.length > 0) || !title || !matchType } onClick={handleSubmit} size="large" type="primary">{_id ? 'Update' : 'Create'}</Button>
              </Space>
            </Spin>
          </Card>
        </Col>
        <Col flex="1"></Col>
      </Row>
    </>
  )
}

export default CreateUpdateRule
