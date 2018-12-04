import { Component } from 'react'
import PropTypes from 'prop-types'

export default class IdCardEncrypt extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    startLen: PropTypes.number,
    endLen: PropTypes.number,
    sign: PropTypes.string,
  }
  static defaultProps = {
    value: '',
    startLen: 6,
    endLen: 6,
    sign: '******',
  }

  render() {
    const { value = '', startLen, endLen, sign } = this.props
    return value ? value.substr(0, startLen) + signvalue.substr(-endLen) : ''
  }
}
