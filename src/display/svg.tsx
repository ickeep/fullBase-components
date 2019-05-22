import React, { Component, HTMLAttributes } from 'react'
import svgXmlObj from '../assets/svgIcon'

export default class Svg extends Component<HTMLAttributes<HTMLAnchorElement> & { src: string }> {
  render() {
    if (!process.browser) {
      return null
    }
    const { src = '', className = '', ...args } = this.props
    const svgXml = svgXmlObj[src] || ''
    return (<span {...args} className={`c-svg ${className || ''}`} dangerouslySetInnerHTML={{ __html: svgXml }}/>)
  }
}
