import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class extends Component {
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
