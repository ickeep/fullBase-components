import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Button, Col, Form as FormC, InputNumber, Row } from "antd";
import { Curd, Form, Input, Select, Link } from 'fullbase-components'
import PropsEdit from './propsEdit'

const typeData: string[] = ['text', 'currency', 'datetime', 'idCardEncrypt', 'keyToValue', 'phoneEncrypt', 'svg']
const typeProps = {
  text: {},
  currency: {
    sign: 'string',
    fixed: 'number',
  },
  datetime: {
    format: 'string'
  },
  idCardEncrypt: {
    startLen: 'number',
    endLen: 'number',
    sign: 'string',
  },
  keyToValue: {
    data: 'string',
    color: 'string',
    colors: 'string',
    isTag: 'boolean'
  },
  phoneEncrypt: {
    startLen: 'number',
    endLen: 'number',
    sign: 'string',
  },
  svg: { src: 'string' }
}
@observer
export default class TableConf extends Component<any> {
  add = () => {
    const { value = [], onChange, values, field } = this.props
    value.push({
      field: '',
      align: '',
      type: '',
      dataIndex: '',
      width: '',
      fixed: '',
      props: [],
      rule: '',
      expression: ''
    })
    values[field] = value
    onChange(values)
  }
  cut = (index: number) => {
    const { value = [], onChange, values, field } = this.props
    value.splice(index, 1)
    values[field] = value
    onChange(values)
  }
  change = (v: any, i: number, type: string) => {
    const { value = [], onChange, values, field, } = this.props
    value[i][type] = v
    if (type === 'type') {
      value[i].props = []
      value[i].dfVal = ''
    }
    values[field] = value
    onChange(values)
  }

  render() {
    const { value = [], dict } = this.props
    const { apiDetail, tableDetail } = dict
    const { fields } = apiDetail
    const { fields: fieldsConf } = tableDetail
    let fieldsData: string[] = []
    if (fields) {
      fieldsData = fields.splice(',')
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
            <FormC.Item label="index">
              <Input value={item.dataIndex} onChange={(v: any) => this.change(v, index, 'dataIndex')}/>
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
          <Col span={8}>
            <FormC.Item label="align">
              <Select value={item.align} data={['left', 'right', 'center']}
                      onChange={(v) => this.change(v, index, 'align')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="width">
              <InputNumber value={item.width} onChange={(v) => this.change(v, index, 'width')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="fixed">
              <Select value={item.fixed} data={['left', 'right']} onChange={(v) => this.change(v, index, 'fixed')}/>
            </FormC.Item>
          </Col><Col span={8}>
          <FormC.Item label="rule">
            <Select value={item.rule} data={['template', 'arithmetic']}
                    onChange={(v) => this.change(v, index, 'rule')}/>
          </FormC.Item>
        </Col><Col span={8}>
          <FormC.Item label="expression">
            <Input value={item.expression} onChange={(v: any) => this.change(v, index, 'expression')}/>
          </FormC.Item>
        </Col>
          <Col span={8}>
            <Button onClick={() => this.cut(index)}>-</Button>
          </Col>
        </Row>
      </div>
    )}
      <Button onClick={this.add}>+</Button>
    </div>
  }
}
