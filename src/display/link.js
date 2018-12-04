import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

export default class extends Component {
  static propTypes = {
    href: PropTypes.string,
  }

  render() {
    const { props } = this
    const { href = '', children = null } = props
    if (/^[./]+/.test(href)) {
      return (<Link {...props} to={href}>{children}</Link>)
    } else {
      return <a target="_blank" rel="noopener noreferrer" {...props} href={href}>{children}</a>
    }
  }
}
