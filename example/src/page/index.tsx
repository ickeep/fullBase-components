import React, { Component } from 'react'
import {
  Svg,
  Captcha,
  Link,
  Cascader,
  Checkbox,
  ImgCaptcha,
  Input,
  Radio,
  RangeDate,
  Select,
  SelectTree,
  TextArea,
  Tree,
  Content,
  Currency,
  Datetime,
  IdCardEncrypt,
  KeyToValue,
  PhoneEncrypt
} from 'fullbase-components'

class App extends Component {
  render() {
    return (
      <div>
        <Link href='/login'>登录</Link>
        <Svg src="404"/>
        <Captcha/>
        <Checkbox data={[2, 3, 4]}/>
        <Cascader/>
        <ImgCaptcha/>
        <Input/>
        <Radio data={{ 1: '111111', 2: '2222222' }}/>
        <RangeDate/>
        <Select data={{ 1: 'name1', 2: 'name2' }}/>
        <SelectTree/>
        <TextArea/>
        <Tree data={[{ id: 1, title: '1111' }]}/>
        <Content loading={true}/>
        <Currency value={123.4567}/>
        <Datetime/>
        <IdCardEncrypt value={445221198710065913}/>
        <IdCardEncrypt value={445221198710065913}/>
        <KeyToValue value={'name'} data={{ name: '名字' }} isTag={true}/>
        <PhoneEncrypt value={13923887814}/>
      </div>
    )
  }

}

export default App
