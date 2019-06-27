import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Button, Col, Form as FormC, Row } from 'antd'
import { Curd, Form, Input, Select, Link } from 'fullbase-components'

const typeData: string[] = ['cascader', 'checkbox', 'input', 'inputNumber', 'radio', 'rangeDate', 'select', 'selectRemote', 'selectTree', 'timestamp']


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
const typeProps = {
  input: {
    icon: 'string',
    addonAfter: 'string',
    addonBefore: 'string',
    defaultValue: 'string',
    disabled: 'boolean',
    id: 'string',
    prefix: 'string',
    size: 'string',
    suffix: 'string',
    type: 'string',
    value: 'string',
    allowClear: 'boolean',
  }
}
@observer
export default class WhereConf extends Component<any> {
  add = () => {
    const { value = [], onChange, values, field } = this.props
    value.push({ field: '', type: '', props: [] })
    values[field] = value
    onChange(values)
  }
  change = (v: any, i: number, type: string) => {
    const { value = [], onChange, values, field } = this.props
    value[i][type] = v
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
      fieldsData = optFields.splice(',')
    } else {
      fieldsData = fieldsConf ? Object.keys(fieldsConf) : []
    }
    return <div>{value.map((item: any, index: number) =>
      <div key={index} style={{ background: '#eee', padding: '10px', marginBottom: '10px' }}>
        <Row>
          <Col span={8}>
            <FormC.Item label="字段">
              <Select value={item.field} data={fieldsData} onChange={(v) => this.change(v, index, 'field')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="type">
              <Select value={item.type} data={typeData} onChange={(v) => this.change(v, index, 'type')}/>
            </FormC.Item>
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
class PropsEdit extends Component<any> {
  add = () => {
    const { value = [], onChange } = this.props
    value.push({ type: '', val: '' })
    onChange(value)
  }
  change = (v: any, index: number, type: string) => {
    const { value = [], onChange } = this.props
    value[index][type] = v
    onChange(value)
  }

  render() {
    const { data, value = [] } = this.props
    return <div>{value.map((item: any, index: number) =>
      <div key={index} style={{ background: '#ddd', padding: '10px', marginBottom: '10px' }}>
        <Row>
          <Col span={8}>
            <Select value={item.type} data={Object.keys(data)} onChange={(v) => this.change(v, index, 'type')}/>
          </Col>
          {item.type &&
          <Col span={8}>
            <PropVal value={item.val} type={item.type} onChange={(v: any) => this.change(v, index, 'val')}/>
          </Col>
          }
        </Row>
      </div>)}
      <Button onClick={this.add}>+</Button>
    </div>
  }
}

@observer
class PropVal extends Component<any> {
  render() {
    const { type, value } = this.props
    return <Input/>
  }
}
