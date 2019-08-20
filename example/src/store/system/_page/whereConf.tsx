import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Button, Col, Form as FormC, Row, Radio, InputNumber } from 'antd'
import { Curd, Form, Input, Select, Link } from 'fullbase-components'
import PropsEdit from './propsEdit'

import { typeProps } from './formMap'

const typeData: string[] = Object.keys(typeProps)

// window.xxx = [].rows
// window.tmpStr = ''
// for (let i = 1; i < window.xxx.length; i += 1) {
//   const item = window.xxx[i]
//   let value = item.cells[2].innerText
//   if (value !== 'function(e)') {
//     value = value.replace('string|ReactNode', 'string')
//     window.tmpStr += `${item.cells[0].innerText}: '${value}',`
//   }
// }
// console.log(window.tmpStr);

@observer
export default class WhereConf extends Component<any> {
  add = () => {
    const { value = [], onChange, values, field } = this.props
    value.push({ title: '', field: '', type: '', data: '', props: [], span: 8, rules: '', dfVal: '' })
    values[field] = value
    onChange(values)
  }
  cut = (index: number) => {
    const { value = [], onChange, values, field } = this.props
    value.splice(index, 1)
    values[field] = value
    onChange(values)
  }
  up = (index: number) => {
    if (index > 0) {
      const { value = [], onChange, values, field } = this.props
      const tmp = value.splice(index, 1)
      value.splice(index - 1, 0, tmp[0])
      values[field] = value
      onChange(values)
    }
  }
  down = (index: number) => {
    const { value = [], onChange, values, field } = this.props
    if (index < value.length - 1) {
      const tmp = value.splice(index, 1)
      value.splice(index + 1, 0, tmp[0])
      values[field] = value
      onChange(values)
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
    values[field] = value
    onChange(values)
  }

  render() {
    const { value = [], dict } = this.props
    const { apiDetail, tableDetail } = dict
    const { optFields } = apiDetail
    const { fields: fieldsConf } = tableDetail
    let fieldsData: string[] = []
    if (optFields) {
      fieldsData = optFields.split(',')
    } else {
      fieldsData = fieldsConf ? Object.keys(fieldsConf) : []
    }
    return <div>{value.map((item: any, index: number) =>
      <div key={index} style={{ width: '100%', background: '#eee', padding: '10px', marginBottom: '10px' }}>
        <Row>
          <Col span={8}>
            <FormC.Item label="字段">
              <Select value={item.field} mode={item.type === 'rangeDate' ? 'multiple' : 'tags'} data={fieldsData}
                      onChange={(v) => this.change(v, index, 'field')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="标题">
              <Input value={item.title} onChange={(v: string) => this.change(v, index, 'title')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="type">
              <Select value={item.type} data={typeData} onChange={(v) => this.change(v, index, 'type')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="span">
              <Select value={item.span} data={[1, 2, 3, 4, 6, 8, 12, 24]}
                      onChange={(v) => this.change(v, index, 'span')}/>
            </FormC.Item>
          </Col>
          <Col span={16}>
            <FormC.Item label="默认值">
              <DfVal value={item.dfVal} type={typeProps[item.type] && typeProps[item.type].value || ''}
                     onChange={(v: any) => this.change(v, index, 'dfVal')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="校验规则">
              <Input value={item.rules} onChange={(v: string) => this.change(v, index, 'rules')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="数据">
              <Input value={item.data} onChange={(v: string) => this.change(v, index, 'data')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <Button onClick={() => this.cut(index)}>-</Button>
            {index > 0 && <Button onClick={() => this.up(index)} icon="up"/>}
            {index < value.length - 1 && <Button onClick={() => this.down(index)} icon="down"/>}
          </Col>
          {item.type &&
          <Col span={24}>
              <FormC.Item label="props">
                  <PropsEdit value={item.props} data={typeProps[item.type]}
                             onChange={(v: any[]) => this.change(v, index, 'props')}/>
              </FormC.Item>
          </Col>}
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
