import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import { message, Row, Col, Skeleton, Card, Tag, Input } from 'antd';
import { RightCircleOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router';
const RuleList = ({ region, lazy = false, search, clickAction=null }) => {
  const [rules, setRules] = useState();
  const [keyword, setKeyword] = useState();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  useEffect(() => {
    if (search) {
      setKeyword(search)
    }
  }, [search])
  const colorMaps = {
    'country': 'orange',
    'lang': 'green',
    'market': 'blue',
    'issuerSegmentation': 'purple'
  }
  useEffect(() => {
    if (!lazy || (lazy && keyword && keyword.length > 2)) {
      (async () => {
        let url = `${process.env.REACT_APP_API_URL}/rules`;
        let params = {};
        if (region) {
          params.regions = region
        }
        if (keyword) {
          params.keyword = keyword
        }
        try {
          setLoading(true)
          const { data } = await Axios.get(url, { params: params });
          setRules(data)
          setLoading(false)
        } catch (e) {
          setLoading(false)
          message.error(e.message, 3)
        }
      })()
    }
  }, [region, lazy, keyword]);
  const handleClick = (_id) => {
    if (clickAction) {
      clickAction(_id)
    } else {
      history.push('/rules/update/'+_id)
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
              loading ?
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
                rules && !loading
                  ? rules.map(
                    item => <Card onClick={()=> handleClick(item._id)} key={item._id} bordered style={{ width: '100%', marginTop: 20 }}
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
                            item.conditions.map((condition) => {
                              return <Tag style={{ fontSize: 20 }} key={condition.attribute} color={colorMaps[condition.attribute]}>
                                {condition.attribute}  <RightCircleOutlined />
                                <strong>
                                  {condition.inValues.map((value, index) => `${index > 0 ? ' | ' : '  '}` + value.title)}
                                </strong>
                              </Tag>
                            })
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
