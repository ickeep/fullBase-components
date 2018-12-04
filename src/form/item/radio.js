import React, { Component } from 'react'
import { Radio } from 'antd'
import PropTypes from 'prop-types'

const OptionComponents = {
  radio: Radio,
  button: Radio.Button
}

// data 支持
// data = { 1: 'name1', 2: 'name2' }
// data = { 1: { name: 'name1' }, 2: { name: 'name2' } } // valKey 不填 取 key
// data = { 1: { id: 1, name: 'name1' }, 2: { id: 2, name: 'name2' } } // valKey = 'id' labelKey = 'name'
// data = [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }] // valKey = 'id' labelKey = 'name'
export default class ReRadio extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isAll: PropTypes.bool,
    data: PropTypes.array,
    type: PropTypes.string,
    valKey: PropTypes.string,
    labelKey: PropTypes.string,
    onChange: PropTypes.func
  }
  static defaultProps = {
    value: '',
    isAll: false,
    type: 'radio',
    data: [],
    valKey: '',
    labelKey: 'name',
    onChange: () => ''
  }

  render() {
    const { value, data, isAll = false, onChange, type, valKey, labelKey } = this.props
    const OptionComponent = OptionComponents[type] || Radio
    return (
      <Radio.Group value={value + ''} size="large" onChange={(e) => onChange(e)}>
        {isAll && <OptionComponent key={''} value="">全部</OptionComponent>}
        {data && typeof data === 'object' && !data.slice && Object.keys(data).map((key) => { // 对像
          if (typeof data[key] !== 'object') {
            return (<OptionComponent key={key} value={key}>{data[key]}</OptionComponent>)
          } else {
            const obj = data[key]
            const value = valKey ? obj[valKey] : key
            const label = obj[labelKey]
            return (<OptionComponent key={value} value={value + ''}>{label}</OptionComponent>)
          }
        })}
        {data && data.slice && (data).map((item) => { // 数组
          const value = item[valKey || 'id']
          const label = item[labelKey]
          return (<OptionComponent key={value} value={value + ''} disabled={item.disabled}>{label}</OptionComponent>)
        })
        }
      </Radio.Group>
    )
  }
}
