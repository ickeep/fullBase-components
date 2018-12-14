import { Component } from 'react'
import { datetime } from '../unit/date'

export default class Datetime extends Component {
  render() {
    const date = this.props.date
    const format = this.props.format || 'YYYY-MM-DD HH:mm:ss'
    return datetime(date, format)
  }
}
