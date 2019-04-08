import { Component } from 'react'

interface IProps {
  value: string,
  startLen?: number,
  endLen?: number,
  sign?: string,
}

export default class IdCardEncrypt extends Component<IProps> {
  render() {
    const { value = '', startLen = 6, endLen = 6, sign = '******' } = this.props
    return value ? value.substr(0, startLen) + sign + value.substr(-endLen) : ''
  }
}
