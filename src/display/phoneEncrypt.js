import { Component } from 'react'
import PropTypes from "prop-types";

export default class PhoneEncrypt extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    startLen: PropTypes.number,
    endLen: PropTypes.number,
    sign: PropTypes.string,
  }
  static defaultProps = {
    value: '',
    startLen: 3,
    endLen: 4,
    sign: '******',
  }

  render() {
    const { value = '' } = this.props
    return value ? value.substr(0, startLen) + sign + value.substr(-endLen) : ''
  }
}
