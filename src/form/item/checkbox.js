import React, { Component } from 'react'
import { Checkbox } from 'antd'
import PropTypes from 'prop-types'

const CheckboxGroup = Checkbox.Group

// data 支持
// data = ['a', 'b'] => [{label:'a',value:0}]
// data = { 1: 'name1', 2: 'name2' }
// data = { 1: { name: 'name1' }, 2: { name: 'name2' } } // valKey 不填 取 key
// data = { 1: { id: 1, name: 'name1' }, 2: { id: 2, name: 'name2' } } // valKey = 'id' labelKey = 'name'
// data = [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }] // valKey = 'id' labelKey = 'name'

export default class ReInput extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    labelKey: PropTypes.string,
    valKey: PropTypes.string,
    split: PropTypes.string,
    onChange: PropTypes.func,
  }
  static defaultProps = {
    value: '',
    data: [],
    labelKey: 'label',
    valKey: 'value',
    split: ',',
    onChange: () => ''
  }
  change = (val) => {
    const { onChange, split, value } = this.props
    onChange(typeof value === 'string' ? val.join(split) : val)
  }

  render() {
    const { labelKey, valKey, data, split } = props
    let checkData = data
    if (data instanceof Array) {
      if (data[0] && typeof data[0] !== 'object') {
        const tmpData = []
        checkData.forEach((item, i) => tmpData.push({ label: item, value: i }))
        checkData = tmpData
      } else if (labelKey !== 'label' || valKey !== 'value') {
        const tmpData = []
        checkData.forEach((item) => tmpData.push({ label: item[labelKey], value: item[valKey] }))
        checkData = tmpData
      }
    } else if (typeof data === 'object') {
      const tmpData = []
      Object.keys(data).forEach((key) => {
        const item = data[key]
        if (typeof item === 'object') {
          tmpData.push({ label: item[labelKey], value: typeof item[valKey] === 'undefined' ? key : item[valKey] })
        } else {
          tmpData.push({ label: item, value: key })
        }
      })
      checkData = tmpData
    }
    let val = value
    if (typeof value === 'string') {
      val = value.split(split)
    }
    return <CheckboxGroup {...props} options={checkData} value={val} onChange={this.change}/>
  }
}
