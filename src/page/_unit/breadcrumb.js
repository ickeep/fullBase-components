import React, { Component } from 'react'
import { Breadcrumb } from 'antd'
import Link from '../../display/link'
import Svg from '../../display/svg'

export default class ReBreadcrumb extends Component {
  render() {
    const { data = [], dfTitle, isIndex = true } = this.props
    if (!data || data.length < 1) {
      data.push({ title: dfTitle })
    }
    return (
      <Breadcrumb>
        {isIndex &&
        <Breadcrumb.Item>
          <Link href="/"><Svg src="index"/></Link>
        </Breadcrumb.Item>
        }
        {data && data.map && data.map((item, i) => {
          if (item.url) {
            return (
              <Breadcrumb.Item key={i}>
                <Link href={item.url}>{item.icon && <Svg src={item.icon}/>}{item.title}</Link>
              </Breadcrumb.Item>
            )
          }
          return <Breadcrumb.Item key={i}>{item.title}</Breadcrumb.Item>
        })}
      </Breadcrumb>
    )
  }
}
