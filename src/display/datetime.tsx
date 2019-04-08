import { Component } from 'react'
import { datetime } from '../unit/date'

interface IProps {
  date: string | number | Date,
  format?: string
}

export default class Datetime extends Component<IProps> {
  render() {
    const { date, format = 'YYYY-MM-DD HH:mm:ss' } = this.props
    return datetime(date, format)
  }
}
