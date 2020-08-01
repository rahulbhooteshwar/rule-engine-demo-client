/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Select, Typography } from 'antd';
import Axios from 'axios';
const { Option } = Select;
const { Text } = Typography;

const LangSelector = ({ country, lang, setLang }) => {
  const [langs, setLangs] = useState([]);
  useEffect(() => {
    if (country) {
      setLangs([]);
      (async () => {
        const { data } = await Axios.get(`${process.env.REACT_APP_API_URL}/languages?country=${country}`);
        setLangs(data);
        const match = data.find(item => item._id === lang)
        if (!match) {
          setLang(null);
        }
      })()
    } else {
      setLangs([]);
    }
  }, [country, setLang])
  return (
    <>
      <Text type="primary" strong>Language</Text>
      <br />
      <Select value={lang} size='large' style={{ width: '100%' }} onChange={setLang} loading={!langs.length}>
        <Option value={null}>Select Lang</Option>
        {
          langs && langs.map(
            item => <Option key={item._id} value={item._id}>{item.title}</Option>
          )
        }
      </Select>
      <br />
      <br/>
    </>
  )
}

export default LangSelector
