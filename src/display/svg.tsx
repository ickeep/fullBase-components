import React, { Component, HTMLAttributes } from 'react'
import svgXmlObj from '../assets/svgIcon'
import { ConfigContext } from '../config'

const svgDataMap = {}
export default class Svg extends Component<HTMLAttributes<HTMLAnchorElement> & { src: string }> {
  static contextType = ConfigContext

  state = { svgXml: '' }
  fetchData = async (): Promise<string> => {
    const { Http, config: { svgUrl = '', apiFormat: { code = '' }, codeSuccess } } = this.context
    const { src = '' } = this.props
    if (svgUrl && src) {
      const data = await Http.httpGet(svgUrl + src + '.svg?xxx', {}, false, {
        responseType: 'text',
        // header: { 'content-type': 'image/svg+xml' }
      })
      console.log('data:===>', data);
      if (data[code] === codeSuccess) {
        svgDataMap[src] = data.data
        return data.data
      }
    }
    return ''
  }

  setSvgXml = async () => {
    const { src = '' } = this.props
    let svgXml = svgXmlObj[src] || svgDataMap[src] || ''
    if (!svgXml) {
      svgXml = await this.fetchData()
    }
    this.setState({ svgXml })
  }

  componentDidMount(): void {
    this.setSvgXml()
  }

  componentDidUpdate(prevProps: any) {
    const { src } = this.props
    const { src: prevSrc } = prevProps
    src && src !== prevSrc && this.setSvgXml()
  }

  render() {
    if (!process.browser) {
      return null
    }
    const { src = '', className = '', ...args } = this.props
    const { svgXml } = this.state
    return (<span {...args} className={`c-svg ${className || ''}`} dangerouslySetInnerHTML={{ __html: svgXml }}/>)
  }
}
