import React, { Component } from 'react'
import { DatePicker } from 'antd'
import moment from 'moment'
import { datetime } from '../../unit/date'
import PropTypes from "prop-types";

const { RangePicker } = DatePicker
export default class RangeDate extends Component {
  static propTypes = {
    start: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    end: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    format: PropTypes.string,
    showTime: PropTypes.bool,
    onChange: PropTypes.func
  }
  static defaultProps = {
    start: '',
    end: '',
    format: 'YYYY-MM-DD',
    showTime: false,
    onChange: () => ''
  }
  change = (e) => {
    const { format, onChange } = this.props
    const start = e[0] ? e[0].format(format) : ''
    const end = e[1] ? e[1].format(format) : ''
    onChange([start, end])
  }

  render() {
    const { format, start, end, showTime, } = this.props
    const value = [null, null]
    if (start) {
      const startDate = datetime(start, format)
      if (!isNaN(Date.parse(startDate))) {
        value[0] = moment(startDate, format)
      }
    }
    if (end) {
      const endDate = datetime(end, format)
      if (!isNaN(Date.parse(endDate))) {
        value[1] = moment(endDate, format)
      }
    }
    return (
      <RangePicker format={format} showTime={showTime} value={value} onChange={this.change}/>
    )
  }
}
