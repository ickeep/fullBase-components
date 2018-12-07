import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Input from './input'
import '../../../assets/less/imgCaptcha.less'

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

  render() {
    const { onGetImg, data, className } = this.props
    const { img } = data
    const newProps = { ...this.props }
    delete newProps.data
    delete newProps.onGetImg
    return (
      <Input
        placeholder="验证码"
        autocomplete="off"
        {...newProps}
        className={`c-img-captcha ${className || ''}`}
        addonAfter={
          <a className="c-img-captcha-btn" href="javascript:;" title="更新验证码" onClick={() => onGetImg()}>
            {img ? <img className="c-img-captcha-img" src={img} alt="验证码"/> : '获取验证码'}
          </a>
        }
      />
    )
  }
}
