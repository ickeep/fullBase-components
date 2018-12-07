import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import '../../../style/imgCaptcha.less'

@observer
export default class extends Component {
  static propTypes = {
    value: PropTypes.string,
    data: PropTypes.object,
    onChange: PropTypes.func,
    onGetImg: PropTypes.func
  }
  static defaultProps = {
    value: '',
    data: {},
    onChange: () => '',
    onGetImg: () => ''
  }
  change = (e) => {
    const value = e.target.value
    this.props.onChange(value)
  }

  render() {
    const { onGetImg, data } = this.props
    const { img } = data
    const newProps = { ...this.props }
    delete newProps.data
    delete newProps.onGetImg
    return (
      <Input
        className="c-img-captcha"
        placeholder="验证码"
        {...newProps}
        onChange={this.change}
        addonAfter={
          <a className="c-img-captcha-btn" href="javascript:;" onClick={() => onGetImg}>
            {img ? <img className="c-img-captcha-img" src={img} alt="验证码"/> : '获取验证码'}
          </a>
        }
      >
      </Input>
    )
  }
}
