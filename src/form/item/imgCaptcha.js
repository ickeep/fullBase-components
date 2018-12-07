import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { Input } from 'antd'

@observer
export default class extends Component {
  static propTypes = {
    value: PropTypes.string,
    src: PropTypes.string,
    onChange: PropTypes.func,
    onGetImg: PropTypes.func
  }
  static defaultProps = {
    value: '',
    src: '',
    onChange: () => '',
    onGetImg: () => ''
  }
  change = (e) => {
    const value = e.target.value
    this.props.onChange(value)
  }

  render() {
    const { src, onGetImg } = this.props
    const newProps = { ...this.props }
    delete newProps.src
    delete newProps.onGetImg
    return (
      <Input
        placeholder="验证码"
        {...newProps}
        onChange={this.change}
        addonAfter={<a href="javascript:;" onClick={() => onGetImg}>{src ? <img src={src} alt="验证码"/> : '获取验证码'}</a>}
      >
      </Input>
    )
  }
}
