import React, { Component } from "react";
import { observer } from 'mobx-react'
import { Button, Tooltip, Tag, Progress, Divider, Table } from 'antd'
import Datetime from '../../display/datetime'
import DetailGrid from './detailGrid'
import PhoneEncrypt from '../../display/phoneEncrypt'
import IdCardEncrypt from "../../display/idCardEncrypt";
import Currency from "../../display/currency";

interface IAdTableProps {
  Store: { [key: string]: any },
  loadingKey: string,
  value: any,
  dataSource: Array<any>
}

@observer
class AdTable extends Component<IAdTableProps> {
  render() {
    const { props } = this
    const { Store, loadingKey, ...args } = props
    return (
      <Table
        pagination={false}
        size='small'
        {...args}
        loading={Store[loadingKey]}
        dataSource={(props.value && props.value.slice && props.value.slice()) || []}/>
    )
  }
}

class AdTab extends Component<{ value?: string | number, color?: string }> {
  render() {
    const { value, color } = this.props
    if (value === null || value === undefined || value === '') return null;
    return <Tag color={color}>{value}</Tag>
  }
}

const renderMap = {
  button: Button,
  tooltip: Tooltip,
  tag: AdTab,
  progress: Progress,
  divider: Divider,
  table: AdTable,
  datetime: Datetime,
  detailGrid: DetailGrid,
  phoneEncrypt: PhoneEncrypt,
  idCardEncrypt: IdCardEncrypt,
  currency: Currency,
}
@observer
export default class DetailRender extends Component<{ item?: { type?: string, props?: object, valProp: string, dataProp: string }, data?: object, Store?: object, scroll?: object, value?: string | number }> {
  render() {
    const { item: { type = '', props = {}, valProp = '', dataProp = '' } = {}, data = {}, value = '', Store, scroll = {} } = this.props
    if (!type) {
      if (typeof value === 'string' || typeof value === 'number' || value === null) {
        return value
      }
      console.error(`值类型为 ${typeof value}无法渲染`)
      return null
    }
    const RenderCom = renderMap[type]
    if (RenderCom) {
      props[valProp || 'value'] = value

      if (dataProp) {
        props[dataProp] = data
      }

      return <RenderCom Store={Store} {...props} scroll={scroll || {}}/>
    }
    console.error(`渲染组件 ${type} 不存在`)
    return null
  }
}
