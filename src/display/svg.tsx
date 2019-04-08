
import React, { Component, HTMLAttributes } from 'react'
import svgXmlObj from '../assets/svgIcon'
import './svg.less'

export default class Svg extends Component<HTMLAttributes<HTMLAnchorElement> & { src: string }> {
  render() {
    if (!process.browser) {
      return null
    }
    const { src = '', className = '' } = this.props
    const svgXml = svgXmlObj[src] || ''
    return (<span {...this.props} className={`c-svg ${className || ''}`} dangerouslySetInnerHTML={{ __html: svgXml }}/>)
  }
}
