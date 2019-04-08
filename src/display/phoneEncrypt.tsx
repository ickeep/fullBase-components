import { Component } from 'react'

interface IProps {
  value: string,
  startLen?: number,
  endLen?: number,
  sign?: string,
}

export default class PhoneEncrypt extends Component<IProps> {
  render() {
    const { value = '', startLen = 3, endLen = 4, sign = '****' } = this.props
    return value ? value.substr(0, startLen) + sign + value.substr(-endLen) : ''
  }
}
