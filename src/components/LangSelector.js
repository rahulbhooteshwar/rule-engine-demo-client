import React, { useEffect } from 'react'
import { Select, Typography } from 'antd';
import { useQuery } from 'react-query';
const { Option } = Select;
const { Text } = Typography;
const fetchLanguages = async (_key, country) => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/languages?country=${country}`)
  return res.json()
}
const LangSelector = ({ country, lang, setLang }) => {
  const {data:langs, status} = useQuery(['langs', country], fetchLanguages, {enabled:country})
  useEffect(() => {
    if (langs) {
      const match = langs.find(item => item._id === lang)
      if (!match) {
        setLang(null);
      }
    } else {
      if (status !== 'loading') {
        setLang(null);
      }
    }
  }, [langs, setLang, lang, status])
  return (
    <>
      <Text type="primary" strong>Language</Text>
      <br />
      <Select value={lang} size='large' style={{ width: '100%' }} onChange={setLang} loading={!langs}>
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
