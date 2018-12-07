import React, { Component } from 'react'
import svgXmlObj from '../../assets/svgIcon'
import '../../assets/less/svg.less'

export default class Svg extends Component {
  render() {
    if (!process.browser) {
      return ''
    }
    const className = this.props.className
    const source = this.props.src || ''
    const svgXml = svgXmlObj[source] || ''
    return (<span {...this.props} className={`c-svg ${className || ''}`} dangerouslySetInnerHTML={{ __html: svgXml }}/>)
  }
}
