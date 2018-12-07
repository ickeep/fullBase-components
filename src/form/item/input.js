import React, { Component } from 'react'
import { Input } from 'antd'
import PropTypes from 'prop-types'
import Svg from '../../display/svg'

export default class ReInput extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    onChange: PropTypes.func,
  }
  static defaultProps = {
    value: '',
    onChange: () => ''
  }
  change = (e) => {
    const value = e.target.value
    this.props.onChange(value)
  }

  render() {
    const { icon } = this.props
    const newProps = { ...this.props }
    delete newProps.icon
    if (icon) {
      newProps.prefix = typeof icon === 'function' ? icon : <Svg src={icon}/>
    }
    return <Input  {...newProps} onChange={this.change}/>
  }
}
