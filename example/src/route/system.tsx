import React, { Component } from 'react'
import { LeftSider, JumpToOne, RenderRoute } from 'fullbase-components'
import Table from '../store/system/table'


const routerConf = {
  rootPath: '/system',
  routers: [
    { path: '', exact: true, component: JumpToOne },
    { path: 'table', store: Table, pages: { add: {}, edit: {}, detail: {}, list: {} } }
  ]
}

export default class System extends Component {
  render() {
    return <LeftSider><RenderRoute {...routerConf}/></LeftSider>
  }
}

