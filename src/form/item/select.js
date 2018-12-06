import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Select } from 'antd'

const Option = Select.Option

// data 支持
// data = { 1: 'name1', 2: 'name2' }
// data = { 1: { name: 'name1' }, 2: { name: 'name2' } } // valKey 不填 取 key
// data = { 1: { id: 1, name: 'name1' }, 2: { id: 2, name: 'name2' } } // valKey = 'id' labelKey = 'name'
// data = [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }] // valKey = 'id' labelKey = 'name'
@observer
export default class extends Component {
  change = (e) => {
    const onChange = this.props.onChange
    if (onChange) {
      onChange((e || '') + '')
    }
  }

  render() {
    const { data, labelKey = 'name', valKey = 'id', isNull = true, showSearch = false, placeholder = '全部' } = this.props
    const dfProps = {}
    if (showSearch) {
      dfProps.optionFilterProp = 'children'
      dfProps.filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    const newProps = Object.assign(dfProps, this.props)
    delete newProps.data
    delete newProps.labelKey
    delete newProps.valKey
    delete newProps.isNull

    return (
      <Select allowClear={true} onChange={this.change} {...newProps}>
        {isNull && <Option key={''} value="">{placeholder}</Option>}
        {data && typeof data === 'object' && !data.slice && Object.keys(data).map((key) => { // 对像
          if (typeof data[key] !== 'object') {
            return (<Option key={key} value={key}>{data[key]}</Option>)
          } else {
            const obj = data[key]
            const value = valKey ? obj[valKey] : key
            const label = obj[labelKey]
            return (<Option key={value} value={value + ''}>{label}</Option>)
          }
        })}
        {data && data.slice && (data).map((item) => { // 数组
          const value = item[valKey || 'id']
          const label = item[labelKey]
          return (<Option key={value} value={value + ''}>{label}</Option>)
        })
        }
      </Select>
    )
  }
}
