import React, { Component } from 'react'
import { observer } from 'mobx-react'
import ItemMap from './itemMap'
import Cascader from './item/cascader'
import RangeDate from './item/rangeDate'
import SelectTree from './item/selectTree'
import Timestamp from './item/timestamp'
import Tree from './item/tree'

@observer
class RangeDateAp extends Component {
  render() {
    const { conf, field, onChange, values } = this.props
    const [startKey, endKey] = field.split(',')
    return <RangeDate {...conf.props} start={values[startKey]} end={values[endKey]} onChange={(val) => {
      values[startKey] = val[0]
      values[endKey] = val[1]
      onChange(values)
    }}/>
  }
}

export default {
  ...ItemMap,
  cascader: Cascader,
  rangeDate: (props) => <RangeDateAp {...props}/>,
  selectTree: SelectTree,
  timestamp: Timestamp,
  tree: Tree,
}

