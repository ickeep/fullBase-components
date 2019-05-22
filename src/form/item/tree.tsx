import React, { Component } from 'react'
import { Tree } from 'antd'
import { AntTreeNodeCheckedEvent, TreeProps } from "antd/lib/tree";

const TreeNode = Tree.TreeNode

type IChange = (checkedKeys: string[] | {
  checked: string[];
  halfChecked: string[];
}, e?: AntTreeNodeCheckedEvent) => void

interface IProps extends TreeProps {
  value?: Array<any>,
  data?: Array<any>,
  valKey?: string,
  labelKey?: string,
  childKey?: string,
  isRemoveParentKey?: boolean,
  onChange?: IChange,
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
  check = (keys: string[], e: any) => {
    const { onChange, isRemoveParentKey, data = [] } = this.props
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
        onChange(newValue, e)
      } else {
        onChange(keys, e)
      }
    }
  }

  render() {
    const { data = [], valKey = 'id', isRemoveParentKey = false, labelKey = 'title', childKey = 'child', value = [], onChange, ...args } = this.props
    let newValue: any[]
    if (isRemoveParentKey) {
      const haveChildIdMap = this.haveChild(data)
      newValue = []
      for (let i = 0; value && i < value.length; i += 1) {
        const item = value[i]
        if (!haveChildIdMap[item]) {
          newValue.push(item)
        }
      }
    } else {
      newValue = value
    }
    return (
      <Tree checkable {...args} checkedKeys={newValue} onCheck={this.check}>
        {childTree({ data, valKey, labelKey, childKey })}
      </Tree>
    )
  }
}

const childTree = function ({ data = [], valKey = 'id', labelKey = 'title', childKey = 'child' }: IProps = {}) {
  return data.map ? data.map((item) =>
    <TreeNode title={item[labelKey]} key={item[valKey]}>
      {item[childKey] && item[childKey].length > 0 && childTree({ data: item[childKey], valKey, labelKey, childKey })}
    </TreeNode>) : null
}
