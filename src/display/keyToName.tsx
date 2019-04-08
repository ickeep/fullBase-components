import React, { Component } from 'react'
import { Tag } from 'antd'

interface IPros {
  index: string | number,
  map?: { [key: string]: string | number },
  colors?: { [key: string]: string }
}

export default class numToName extends Component<IPros> {
  render() {
    const { index, map = {}, colors = {} } = this.props
    const text = map[index] || index
    const color = colors[index] || 'blue'
    return (<Tag color={color}>{text}</Tag>)
  }
}
