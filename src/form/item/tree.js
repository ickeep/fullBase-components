import React, { Component } from 'react'
import { Tree } from 'antd'
import PropTypes from 'prop-types'

const TreeNode = Tree.TreeNode
export default class  extends Component {
  static propTypes = {
    value: PropTypes.array,
    data: PropTypes.array,
    key: PropTypes.string,
    titleKey: PropTypes.string,
    childKey: PropTypes.string,
    parentKeyAll: PropTypes.bool,
    onChange: PropTypes.func,
  }
  static defaultProps = {
    value: [],
    data: [],
    key: 'id',
    titleKey: 'title',
    childKey: 'child',
    parentKeyAll: 'false',
    onChange: () => '',
  }

  // check = (checkedKeys) => {
  //   this.props.onChange(checkedKeys)
  // }

  render() {
    const { data = [], key, titleKey, childKey, value = [], type, parentKeyAll,onChange } = this.props
    const newProps = Object.assign({}, this.props)
    delete newProps.titleKey
    delete newProps.key
    delete newProps.data
    delete newProps.childKey
    delete newProps.value
    delete newProps.type
    // const checkedKeys = (value && value.slice && value.slice()) || []
    let checkedKeys = []
    if (parentKeyAll === false) {
      const parentKeyMap = {}
      data.forEach((item) => parentKeyMap[item[key]] = true)
      value.forEach((item) => !parentKeyMap[item] && checkedKeys.push(item))
    } else {
      checkedKeys = (value && value.slice && value.slice()) || []
    }
    return (
      <Tree checkable {...newProps} checkedKeys={checkedKeys} onCheck={onChange}>
        {childTree({ data, key, titleKey, childKey, type })}
      </Tree>
    )
  }
}

const childTree = function ({ data = [], key = 'id', titleKey = 'title', childKey = 'child', type } = {}) {
  // if (type !== 'onlyShow') {
  return data.map ? data.map((item, index) =>
    <TreeNode title={item[titleKey]} key={typeof item[key] === 'function' ? index : item[key] + ''}>
      {item[childKey] && childTree({ data: item[childKey], key, titleKey, childKey })}
    </TreeNode>) : ''
  // }
}
