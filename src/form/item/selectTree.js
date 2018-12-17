import React, { Component } from 'react'
import { TreeSelect } from 'antd'
import PropTypes from "prop-types";

// TODO treeData 不应该放在 render 中  待优化
export default class SelectTree extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    field: PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
      label: PropTypes.string,
      name: PropTypes.string,
      child: PropTypes.string
    }),
    data: PropTypes.array,
    multiple: PropTypes.bool,
    onChange: PropTypes.func,
  }
  static defaultProps = {
    value: '',
    field: { key: 'id', value: 'id', label: 'name', children: 'child' },
    data: [],
    multiple: true,
    onChange: () => ''
  }

  valToValText = {}

  handle(arr = []) {
    const field = Object.assign({ key: 'id', value: 'id', title: 'name', children: 'child' }, this.props.field)
    const newArr = []

    arr.forEach(item => {
      const newItem = {
        title: item[field.title],
        value: this.props.multiple ? (item[field.value] + '') : `${item[field.value]}-${item[field.label]}`,
        key: `${item[field.key]}-${item[field.label]}`
      }
      if (item[field.children]) {
        newItem.children = this.handle(item[field.children], field)
      }
      this.valToValText[item[field.value] + ''] = newItem.value
      newArr.push(newItem)
    })
    return newArr
  }

  componentDidMount() {
    // const treeData = this.handle(this.props.data)
    // if (!this.props.multiple) {
    //   this.treeData = [{ title: '请选择', value: '', key: '' }].concat(treeData)
    // } else {
    //   this.treeData = treeData
    // }
  }

  change = (val) => {
    const change = this.props.onChange
    if (change) {
      if (this.props.multiple) {
        if (typeof this.props.value === 'string') {
          change(val.length > 0 ? val.join(',') : '')
        } else {
          change(val)
        }
      } else {
        const value = val ? val.split('-')[0] : ''
        change(value)
      }
    }
  }

  render() {
    let treeData = this.handle(this.props.data)
    const multiple = this.props.multiple
    const oldValue = this.props.value || ''
    if (multiple) {
      const oldValue = this.props.value || ''
      const oldValueArr = typeof oldValue === 'string' ? oldValue.split(',') : oldValue
      const valueArr = []
      oldValueArr.forEach(val => {
        val && valueArr.push(val + '')
      })
      return (
        <TreeSelect
          allowClear={true}
          {...this.props}
          value={valueArr}
          treeData={treeData}
          onChange={this.change}
        />
      )
    } else {
      treeData = [{ title: '请选择', value: '', key: '' }].concat(treeData)
      const value = this.valToValText[oldValue] ? this.valToValText[oldValue] : ''
      return (
        <TreeSelect allowClear={true} {...this.props} value={value} treeData={treeData} onChange={this.change}/>)
    }
  }
}
