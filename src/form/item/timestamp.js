import React, { Component } from 'react'
import { DatePicker } from 'antd'
import moment from 'moment'
import { datetime } from '../../unit/date'
import PropTypes from 'prop-types'

export default class RangeTimeStamp extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    format: PropTypes.string,
    onChange: PropTypes.func,
  }
  static defaultProps = {
    value: '',
    format: 'YYYY-MM-DD HH:mm:ss',
    onChange: () => ''
  }

  change = (e) => {
    const { format } = this.props
    const value = e ? new Date(e.format(format.replace('-', '/'))).getTime() : ''
    this.props.onChange(value)
  }

  render() {
    const { format } = this.props
    const timestamp = parseInt(this.props.value || '', 10)
    const value = timestamp > 0 ? moment(datetime(timestamp), format) : null
    return (
      <DatePicker showTime format={format} value={value} onChange={this.change}/>
    )
  }
}
