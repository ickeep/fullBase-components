import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ItemMap from './itemMap'

export default class ItemType extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    conf: PropTypes.object,
    values: PropTypes.object,
    data: PropTypes.object,
    itemMap: PropTypes.object
  }
  static defaultProps = {
    loading: false,
    conf: {},
    values: {},
    data: {},
    itemMap: ItemMap
  }

  change = (val, key) => {
    const formObj = {}
    formObj[key] = val || ''
    this.props.onChange(formObj)
  }

  render() {
    const { values, conf = {}, data, loading, itemMap } = this.props
    const { field, props = {} } = conf
    const value = values[field]
    const itemData = data[conf.data]
    const type = conf.type || 'Default'
    const Render = typeof conf.render === 'function' ? conf.render : itemMap[type]
    if (!Render) {
      return null
    }
    let newProps = { value, onChange: (val) => this.change(val, field) }
    if (itemData) {
      newProps.data = itemData
    }
    if (typeof Render === 'function') {
      newProps = { ...newProps, conf, loading, values, dict: data }
    }
    return <Render {...newProps} {...props}/>
  }
}
