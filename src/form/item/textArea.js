import React, { Component } from 'react'
import { InputNumber } from 'antd'
import PropTypes from 'prop-types'

export default class ReInput extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
  }
  static defaultProps = {
    value: '',
    onChange: () => ''
  }

  render() {
    return <InputNumber {...this.props}/>
  }
}
