import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Input from './input'
import '../../../assets/less/captcha.less'

@observer
export default class  extends Component {
  constructor(props) {
    super(props)
    this.IntervalID = ''
    this.state = { remain: 0 }
  }

  componentWillUnmount() {
    clearTimeout(this.IntervalID)
  }

  getCode = async () => {
    const { remain } = this.state
    const { isAction, onGetCode } = this.props
    if (remain < 1 && isAction && typeof onGetCode === 'function') {
      const codeData = await onGetCode()
      if (codeData.errno === 0) {
        let remainNum = 60
        this.setState({ remain: remainNum })
        this.IntervalID = setInterval(() => {
          remainNum -= 1
          this.setState({ remain: remainNum })
          if (remainNum < 1) {
            clearTimeout(this.IntervalID)
          }
        }, 1000)
      }
    }
  }

  render() {
    const { isAction, className } = this.props
    const newProps = { ...this.props }
    delete newProps.isAction
    delete newProps.onGetCode
    const { remain } = this.state
    return (
      <Input
        placeholder="验证码"
        autoComplete="off"
        {...newProps}
        className={`c-captcha ${className || ''} `}
        addonAfter={
          <a href="javascript:;" className={`c-captcha-btn ${remain < 1 && isAction ? 'z-active' : ''}`}
             onClick={this.getCode}>
            {remain > 0 ? `${remain}S` : `获取验证码`}
          </a>
        }
      />)
  }
}
