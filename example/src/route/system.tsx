import React, { Component } from 'react'
import { LeftSider, JumpToOne, RenderRoute } from 'fullbase-components'
import Table from '../store/system/table'
import Dict from '../store/system/dict'


const routerConf = {
  rootPath: '/system',
  routers: [
    { path: '', exact: true, component: JumpToOne },
    { path: 'table', store: Table, pages: { add: {}, edit: {}, detail: {}, list: {} } },
    { path: 'dict', store: Dict, pages: { add: {}, edit: {}, detail: {}, list: {} } }
  ]
}

export default class System extends Component {
  render() {
    return <LeftSider><RenderRoute {...routerConf}/></LeftSider>
  }
}

