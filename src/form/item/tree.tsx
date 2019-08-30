import React, { Component } from 'react'
import { Tree } from 'antd'
import { TreeProps } from "antd/lib/tree";

const TreeNode = Tree.TreeNode


interface IProps extends TreeProps {
  value?: Array<any> | string,
  data?: Array<any>,
  valKey?: string,
  splitKey?: string,
  labelKey?: string,
  childKey?: string,
  isRemoveParentKey?: boolean,
  onChange?: Function,
}


export default class extends Component<IProps> {
  haveChild: Function
  check: any

  constructor(props: IProps) {
    super(props)
    const { valKey = 'id', childKey = 'child' } = props

    this.haveChild = (treeData: any[], map?: any) => {
      const tmpMap = map || {}
      for (let i = 0; i < treeData.length; i += 1) {
        const item = treeData[i]
        if (item[childKey] && item[childKey].length > 0) {
          tmpMap[item[valKey]] = 1
          this.haveChild(item[childKey], tmpMap)
        }
      }
      return tmpMap
    }
  }

  // @ts-ignore
  check = (keysOpt: any, e: any) => {
    const { onChange, isRemoveParentKey, data = [], value, splitKey = ',', checkStrictly } = this.props
    const keys = checkStrictly === true ? keysOpt.checked : keysOpt
    if (onChange) {
      if (isRemoveParentKey) {
        const haveChildIdMap = this.haveChild(data)
        const newValue = []
        for (let i = 0; keys && i < keys.length; i += 1) {
          const item = keys[i]
          if (!haveChildIdMap[item]) {
            newValue.push(item)
          }
        }
        onChange(typeof value === "string" || value === null ? newValue.join(splitKey) : newValue, e)
      } else {
        onChange(typeof value === "string" || value === null ? keys.join(splitKey) : keys, e)
      }
    }
  }

  render() {
    const { data = [], valKey = 'id', isRemoveParentKey = false, labelKey = 'name', childKey = 'child', value = [], splitKey = ',', ...args } = this.props
    let newValue: any[]
    const valueArr = value === '' ? [] : (typeof value === 'string' ? value.split(splitKey) : value || [])
    if (isRemoveParentKey) {
      const haveChildIdMap = this.haveChild(data)
      newValue = []
      for (let i = 0; valueArr && i < valueArr.length; i += 1) {
        const item = valueArr[i]
        if (!haveChildIdMap[item]) {
          newValue.push(item)
        }
      }
    } else {
      newValue = valueArr
    }
    if (!data || data.length < 1) {
      return <Tree/>
    }
    return (
      <Tree checkable {...args} checkedKeys={newValue} onCheck={this.check}>
        {childTree({ data, valKey, labelKey, childKey })}
      </Tree>
    )
  }
}

const childTree = function ({ data = [], valKey = 'id', labelKey = 'name', childKey = 'child' }: IProps = {}) {
  return data.map ? data.map((item) =>
    <TreeNode title={item[labelKey]} key={item[valKey]}>
      {item[childKey] && item[childKey].length > 0 && childTree({ data: item[childKey], valKey, labelKey, childKey })}
    </TreeNode>) : null
}
