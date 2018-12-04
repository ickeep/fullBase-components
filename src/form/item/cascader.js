import React, { Component } from 'react'
import { Cascader } from 'antd'
import PropTypes from 'prop-types'

export default class SelectTree extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    valIsArr: PropTypes.bool,
    data: PropTypes.array,
    valKey: PropTypes.string,
    labelKey: PropTypes.string,
    valueField: PropTypes.string,
    parentKey: PropTypes.string,
    split: PropTypes.string,
    changeOnSelect: PropTypes.bool,
    onChange: PropTypes.func
  }
  static defaultProps = {
    value: '',
    valIsArr: false,
    data: [],
    valKey: 'value',
    labelKey: 'label',
    valueField: 'value',
    parentKey: '',
    split: '/',
    changeOnSelect: true,
  }

  change = (e) => {
    const { onChange, split, valIsArr, } = this.props
    if (onChange) {
      onChange(valIsArr ? e : (e || []).join(split))
    }
  }

  render() {
    function addChild(arr = [], parentMap) {
      const treeArr = []
      for (let i = 0; i < arr.length; i += 1) {
        const item = arr[i]
        const code = item[valueField]
        const tmpObj = {}
        tmpObj.value = item[valKey]
        tmpObj.label = item[labelKey]
        if (parentMap[code]) {
          tmpObj.children = addChild(parentMap[code], parentMap)
        }
        treeArr.push(tmpObj)
      }
      return treeArr
    }

    const {
      value = '',
      valIsArr = false,
      data = [],
      valKey = 'value',
      labelKey = 'label',
      valueField = 'value',
      parentKey,
      split = '/',
      changeOnSelect = true,
      ...args,
    } = this.props
    let options = [];
    if (!parentKey) {
      options = data;
    } else {
      const parentMap = {}
      for (let i = 0; i < data.length; i += 1) {
        const item = data[i]
        const parentCode = item[parentKey || 'parent'];
        if (!parentMap[parentCode]) {
          parentMap[parentCode] = []
        }
        parentMap[parentCode].push(item)
      }
      options = addChild(parentMap[0], parentMap)
    }
    return (
      <Cascader
        {...args}
        placeholder="请选择"
        value={valIsArr ? value.slice && value.slice() : value ? value.split(split) : []}
        options={options}
        allowClear={true}
        onChange={this.change}
        changeOnSelect={changeOnSelect}
      />
    )
  }
}
