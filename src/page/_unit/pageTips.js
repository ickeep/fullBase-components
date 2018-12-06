import React, { Component } from "react"
import { Alert } from 'antd'

export default class PageTips extends Component {
  render() {
    const { show = true } = this.props
    const isShow = typeof show === 'function' ? show() : show
    if (!isShow) {
      return null
    }
    return <Alert showIcon={true} {...this.props} className='u-page-tips'/>
  }
}
