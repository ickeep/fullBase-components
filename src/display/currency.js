import { Component } from 'react'
import PropTypes from 'prop-types'

export default class Currency extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sign: PropTypes.string,
  }
  static defaultProps = {
    value: '',
    sign: '¥ '
  }

  render() {
    const { value, sign } = this.props
    if (!value) {
      return ''
    }
    const p = (+value).toFixed(2).split('.')
    return sign + p[0].replace(/(?!^)(?=(\d{3})+$)/g, ',') + '.' + p[1]
  }
}
