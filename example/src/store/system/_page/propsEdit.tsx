import { observer } from "mobx-react";
import React, { Component } from "react";
import { Button, Col, Form as FormC, InputNumber, Radio, Row } from "antd";
import { Input, Select } from 'fullbase-components'

@observer
export default class PropsEdit extends Component<any> {
  add = () => {
    const { value = [], onChange } = this.props
    value.push({ key: '', val: '', rule: '', expression: '' })
    onChange(value)
  }
  cut = (index: number) => {
    const { value = [], onChange } = this.props
    value.splice(index, 1)
    onChange(value)
  }
  change = (v: any, index: number, type: string) => {
    const { value = [], onChange } = this.props
    value[index][type] = v
    if (type === 'key') {
      value[index].val = ''
    }
    onChange(value)
  }

  render() {
    const { data = {}, value = [] } = this.props
    return <div>{value.map((item: any, index: number) =>
      <div key={index} style={{ background: '#ddd', padding: '10px', marginBottom: '10px', minWidth: '680px' }}>
        <Row>
          <Col span={8}>
            <FormC.Item label="key">
              <Select value={item.key} data={Object.keys(data)} onChange={(v) => this.change(v, index, 'key')}/>
            </FormC.Item>
          </Col>
          {item.type &&
          <>
            <Col span={12}>
              <FormC.Item label="val">
                <PropVal value={item.val} type={data[item.type]} onChange={(v: any) => this.change(v, index, 'val')}/>
              </FormC.Item>
            </Col>
            <Col span={8}>
              <FormC.Item label="rule">
                <Select value={item.rule} data={['template', 'arithmetic']}
                        onChange={(v) => this.change(v, index, 'rule')}/>
              </FormC.Item>
            </Col>
            {item.rule &&
            <Col span={8}>
              <FormC.Item label="表达式">
                <Input value={item.expression} onChange={(v: any) => this.change(v, index, 'expression')}/>
              </FormC.Item>
            </Col>
            }
          </>
          }
          <Col span={8}>
            <Button onClick={() => this.cut(index)}>-</Button>
          </Col>
        </Row>
      </div>)}
      <Button onClick={this.add}>+</Button>
    </div>
  }
}


@observer
class PropVal extends Component<any> {
  change = (e: any) => {
    const { onChange } = this.props
    onChange(e.target.value)
  }

  render() {
    const { type, value, onChange } = this.props
    const typeArr = type.split('|')
    if (type === 'string') {
      return <Input value={value} onChange={onChange}/>
    }
    if (type === 'number') {
      return <InputNumber value={value} onChange={onChange}/>
    }
    if (type === 'boolean') {
      return <Radio.Group onChange={this.change} value={value}>
        <Radio value={true}>true</Radio>
        <Radio value={false}>false</Radio>
      </Radio.Group>
    }
    if (typeArr.length > 1) {
      return <Select value={value} data={typeArr} onChange={onChange}/>
    }
    return null
  }
}
