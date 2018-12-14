import React, { Component } from 'react'
import { Tag } from 'antd'

export default class numToName extends Component {
  render() {
    const num = this.props.index
    const map = this.props.map || {}
    const colors = this.props.colors || {}
    const text = map[num] || num
    const color = colors[num] || 'blue'
    return (<Tag color={color}>{text}</Tag>)
  }
}
