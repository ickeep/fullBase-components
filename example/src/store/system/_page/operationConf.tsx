import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Button, Col, Form as FormC, Row, } from 'antd'
import { Input, Select } from 'fullbase-components'
import PropsEdit from './propsEdit'
import { typeProps } from './displayMap'

@observer
export default class OperationConf extends Component<any> {
  add = () => {
    const { value = [], onChange, values, field } = this.props
    let newValue
    if (typeof value.push !== 'function') {
      newValue = []
    } else {
      newValue = value
    }
    newValue.push({
      name: '',
      isShow: '',
      isShowRow: '',
      isBatch: '',
      props: [],
      action: '',
      actionApi: '',
      whom: '',
      isConfirm: '',
      urlExpression: ''
    })
    values[field] = newValue
    onChange(newValue)
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
      value.splice(index - 1, 0, tmp)
      values[field] = value
      onChange(values)
    }
  }
  down = (index: number) => {
    const { value = [], onChange, values, field } = this.props
    if (index < value.length - 1) {
      const tmp = value.splice(index, 1)
      value.splice(index + 1, 0, tmp)
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
    const { apiDetail, tableDetail, actionApi } = dict
    const { optFields } = apiDetail
    const { fields: fieldsConf } = tableDetail
    let fieldsData: string[] = []
    if (optFields) {
      fieldsData = optFields.split(',')
    } else {
      fieldsData = fieldsConf ? Object.keys(fieldsConf) : []
    }
    return <div>{value.map && value.map((item: any, index: number) =>
      <div key={index} style={{ width: '100%', background: '#eee', padding: '10px', marginBottom: '10px' }}>
        <Row>
          <Col span={8}>
            <FormC.Item label="名字">
              <Input value={item.name} onChange={(v: string) => this.change(v, index, 'name')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="显示条件">
              <Input value={item.isShow} onChange={(v: string) => this.change(v, index, 'isShow')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="是否行显示">
              <Select value={item.isShowRow} data={dict.yesOrNo}
                      onChange={(v: any) => this.change(v, index, 'isShowRow')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="是否批量">
              <Select value={item.isBatch} data={dict.yesOrNo} onChange={(v: any) => this.change(v, index, 'isBatch')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="是否确认">
              <Select value={item.isConfirm} data={dict.yesOrNo}
                      onChange={(v: any) => this.change(v, index, 'isConfirm')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="操作方法">
              <Select value={item.action} data={['freeze', 'unfreeze', 'del']} valKey="url" labelKey="desc"
                      onChange={(v: any) => this.change(v, index, 'action')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="操作接口">
              <Select value={item.actionApi} data={actionApi} valKey="url" labelKey="desc"
                      onChange={(v: any) => this.change(v, index, 'actionApi')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="操作参数">
              <Select value={item.actionOpt} data={fieldsData}
                      onChange={(v: any) => this.change(v, index, 'actionOpt')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="对象下标">
              <Input value={item.whom} onChange={(v: string) => this.change(v, index, 'whom')}/>
            </FormC.Item>
          </Col>
          <Col span={16}>
            <FormC.Item label="跳转URL">
              <Input value={item.urlExpression} onChange={(v: string) => this.change(v, index, 'urlExpression')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <Button onClick={() => this.cut(index)}>-</Button>
            {index > 0 && <Button onClick={() => this.up(index)} icon="up"/>}
            {index < value.length - 1 && <Button onClick={() => this.down(index)} icon="down"/>}
          </Col>
          <Col span={24}>
            <FormC.Item label="props">
              <PropsEdit value={item.props} data={typeProps.button}
                         onChange={(v: any[]) => this.change(v, index, 'props')}/>
            </FormC.Item>
          </Col>
        </Row>
      </div>
    )}
      <Button onClick={this.add}>+</Button>
    </div>
  }
}

