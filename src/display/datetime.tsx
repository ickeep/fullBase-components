import { Component } from 'react'
import { datetime } from '../unit/date'

interface IProps {
  value?: string | number | Date,
  format?: string
}

export default class Datetime extends Component<IProps> {
  render() {
    const { value = new Date(), format = 'YYYY-MM-DD HH:mm:ss' } = this.props
    return datetime(value, format)
  }
}
