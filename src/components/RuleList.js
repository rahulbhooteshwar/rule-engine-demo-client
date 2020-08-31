import React, { useState, useEffect } from 'react'
import { Row, Col, Skeleton, Card, Tag, Input } from 'antd';
import { RightCircleOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router';
import { useQuery } from 'react-query';
const fetchRules = async (_key, region, keyword) => {
  const url = new URL(`${process.env.REACT_APP_API_URL}/rules`)
  if (region) {
    url.searchParams.append('regions', region)
  }
  if (keyword) {
    url.searchParams.append('keyword', keyword)
  }
  const response = await fetch(url)
  return response.json()
}
const RuleList = ({ region, lazy = false, search, clickAction = null }) => {
  const history = useHistory();
  const [keyword, setKeyword] = useState();
  const {data:rules, status} = useQuery(['fetchRules', region, keyword], fetchRules, {enabled: (!lazy || (lazy && keyword && keyword.length > 2))})
  useEffect(() => {
    if (search) {
      setKeyword(search)
    }
  }, [search])
  const handleClick = (_id) => {
    if (clickAction) {
      clickAction(_id)
    } else {
      history.push('/rules/update/' + _id)
    }
  }
  return (
    <>
      <Row>
        <Col flex="1" style={{ padding: 25, background: '#ececec' }}>
          {
            lazy
              ? <Input size="large" allowClear placeholder="Type something..." value={keyword} onChange={e => setKeyword(e.target.value)} />
              : ''
          }
          {
            status === 'loading' ?
              <>
                <Skeleton active paragraph={{ rows: 2 }} />
                <Skeleton active paragraph={{ rows: 2 }} />
                <Skeleton active paragraph={{ rows: 2 }} />
                <Skeleton active paragraph={{ rows: 2 }} />
              </>
              : ''
          }
          <div style={{ marginTop: 20 }}>
            {
              rules && status !== 'loading'
                ? rules.map(
                  item => <Card onClick={() => handleClick(item._id)} key={item._id} bordered style={{ width: '100%', marginTop: 20 }}
                    hoverable>
                    <Row>
                      <Col flex="1">
                        <h2 style={{ display: 'inline-block' }}>
                          {item.title}
                        </h2>
                      </Col>
                      <Col flex="4">
                        <Tag style={{ fontSize: 20 }} color="gold">Match Type : <strong>{item.conditionMatchType}</strong></Tag>
                        <Tag style={{ fontSize: 20 }} color="magenta">REGIONS : <strong>{item.regions.map(region => ' ' + region.title)}</strong></Tag>
                        {
                          item.countries
                          && item.countries.length
                          ? <Tag style={{ fontSize: 20 }} color='orange'>
                            Countries  <RightCircleOutlined />
                            <strong>
                              {item.countries.map((value, index) => `${index > 0 ? ' | ' : '  '}` + value.title)}
                            </strong>
                          </Tag> : ''
                        }
                        {
                          item.languages
                          && item.languages.length
                          ? <Tag style={{ fontSize: 20 }} color='green'>
                            Languages  <RightCircleOutlined />
                            <strong>
                              {item.languages.map((value, index) => `${index > 0 ? ' | ' : '  '}` + value.title)}
                            </strong>
                          </Tag> : ''
                        }
                        {
                          item.markets
                          && item.markets.length
                          ? <Tag style={{ fontSize: 20 }} color='blue'>
                            Markets  <RightCircleOutlined />
                            <strong>
                              {item.markets.map((value, index) => `${index > 0 ? ' | ' : '  '}` + value.title)}
                            </strong>
                          </Tag> : ''
                        }
                        {
                          item.issuerSegmentations
                          && item.issuerSegmentations.length
                          ? <Tag style={{ fontSize: 20 }} color='purple'>
                            Issuer Segmentations  <RightCircleOutlined />
                            <strong>
                              {item.issuerSegmentations.map((value, index) => `${index > 0 ? ' | ' : '  '}` + value.title)}
                            </strong>
                          </Tag> : ''
                        }
                      </Col>
                    </Row>

                  </Card>
                )
                : ''
            }
          </div>
        </Col>
      </Row>
    </>
  )
}

export default RuleList
