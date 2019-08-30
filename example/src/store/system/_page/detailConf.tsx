import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Button, Col, Form as FormC, Row, Radio, InputNumber } from 'antd'
import { Input } from 'fullbase-components'
import WhereConf from './whereConf'

@observer
export default class FormConf extends Component<any> {
  add = () => {
    const { value = [], onChange } = this.props
    let newValue
    if (typeof value.push !== 'function') {
      newValue = []
    } else {
      newValue = value
    }
    onChange(newValue)
    newValue.push({ title: '', fields: [] })
    onChange(newValue)
  }
  cut = (index: number) => {
    const { value = [], onChange } = this.props
    value.splice(index, 1)
    onChange(value)
  }
  up = (index: number) => {
    if (index > 0) {
      const { value = [], onChange } = this.props
      const tmp = value.splice(index, 1)
      value.splice(index - 1, 0, tmp[0])
      onChange(value)
    }
  }
  down = (index: number) => {
    const { value = [], onChange } = this.props
    if (index < value.length - 1) {
      const tmp = value.splice(index, 1)
      value.splice(index + 1, 0, tmp[0])
      onChange(value)
    }
  }
  change = (v: any, i: number, type: string) => {
    const { value = [], onChange, values, field, dict } = this.props
    const { tableDetail } = dict
    const { fieldMap } = tableDetail
    value[i][type] = v
    if (type === 'type') {
      value[i].props = []
      value[i].dfVal = ''
    }
    if (type === 'field' && v && fieldMap[v]) {
      value[i].title = fieldMap[v].desc
    }
    onChange(value)
  }

  render() {
    const { value = [], dict } = this.props
    return <div>{value && value.map && value.map((item: any, index: number) =>
      <div key={index} style={{ width: '100%', background: '#eee', padding: '10px', marginBottom: '10px' }}>
        <Row>
          <Col span={8}>
            <FormC.Item label="标题">
              <Input value={item.title} onChange={(v: string) => this.change(v, index, 'title')}/>
            </FormC.Item>
          </Col>
          <Col span={24}>
            <FormC.Item label="字段">
              <WhereConf dict={dict} value={item.fields} onChange={(v: string) => this.change(v, index, 'fields')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <Button onClick={() => this.cut(index)}>-</Button>
            {index > 0 && <Button onClick={() => this.up(index)} icon="up"/>}
            {index < value.length - 1 && <Button onClick={() => this.down(index)} icon="down"/>}
          </Col>
        </Row>
      </div>
    )}
      <Button onClick={this.add}>+</Button>
    </div>
  }
}

@observer
class DfVal extends Component<any> {
  render() {
    const { value, type, onChange } = this.props
    if (!type) {
      return <div>请选择类型</div>
    }
    const typeArr = type.split('|')
    return <div>
      <div style={{ display: 'inline-block' }}>
        <Radio.Group onChange={(e: any) => onChange(e.target.value)} value={value}>
          {typeArr.indexOf('boolean') >= 0 &&
          <>
              <Radio value={true}>true</Radio>
              <Radio value={false}>false</Radio>
          </>
          }
          {typeArr.indexOf('array') >= 0 &&
          <Radio value={'_[]'}>[]</Radio>
          }
          {typeArr.indexOf('object') >= 0 &&
          <Radio value={'_{}'}>{'{}'}</Radio>
          }
          {typeArr.length > 1 && typeArr.indexOf('string') >= 0 &&
          <Radio value={''}>string</Radio>
          }
          {typeArr.length > 1 && typeArr.indexOf('number') >= 0 &&
          <Radio value={0}>number</Radio>
          }
        </Radio.Group>
      </div>
      {(value !== '_{}' && value !== '_[]') &&
      <div style={{ display: 'inline-block' }}>
        {(type === 'string' || typeof value === 'string' && type !== 'number') &&
        <Input value={value} onChange={onChange}/>}
        {(type === 'number' || typeof value === 'number' && type !== 'string') &&
        <InputNumber value={value} onChange={onChange}/>}
      </div>
      }
    </div>
  }
}
