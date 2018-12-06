import React, { Component } from "react";
import { observer } from 'mobx-react'
import { Button, Tooltip, Tag, Progress, Divider, Table } from 'antd'
import Datetime from '../../display/datatime'
import DetailGrid from './detailGrid'
import PhoneEncrypt from '../../display/phoneEncrypt'
import IdCardEncrypt from "../../display/idCardEncrypt";
import Currency from "../../display/currency";

@observer
class AdTable extends Component {
  render() {
    const { props } = this
    const { Store, loadingKey } = props
    const dfProps = { pagination: false, size: 'small', width: '100%' }
    const newProps = { ...dfProps, ...props, loading: Store[loadingKey] }
    newProps.dataSource = (props.value && props.value.slice && props.value.slice()) || []
    delete newProps.value
    return <Table {...newProps}/>
  }
}

class AdTab extends Component {
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
export default class DetailRender extends Component {
  render() {
    const { item = {}, data = {}, value = '', Store, scroll = {} } = this.props
    if (!item.type) {
      if (typeof value === 'string' || typeof value === 'number' || value === null) {
        return value
      }
      console.error(`值类型为 ${typeof value}无法渲染`)
      return null
    }
    const RenderCom = renderMap[item.type]
    if (RenderCom) {
      const { props = {}, valProp, dataProp } = item
      props[valProp || 'value'] = value

      if (dataProp) {
        props[dataProp] = data
      }

      return <RenderCom Store={Store} {...props} scroll={scroll || {}}/>
    }
    console.error(`渲染组件 ${item.type} 不存在`)
    return null
  }
}
