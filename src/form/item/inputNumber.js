import React, { Component } from 'react'
import { Input } from 'antd'
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
  change = (e) => {
    const value = e.target.value
    this.props.onChange(value)
  }

  render() {
    return <Input {...props} onChange={this.change}/>
  }
}
