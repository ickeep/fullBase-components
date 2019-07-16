import React, { Component } from 'react'
import { Link, Svg } from 'fullbase-components'

class P404 extends Component {
  render() {
    return (
      <div id="p-404">
        <Svg src="404" className="u-icon"/>
        <Link href="/" className="u-link">返回首页</Link>
      </div>
    )
  }
}

export default P404
