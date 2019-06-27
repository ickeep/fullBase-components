import React, { Component } from 'react'
import { LeftSider, JumpToOne, RenderRoute } from 'fullbase-components'
import Table from '../store/system/table'
import Dict from '../store/system/dict'
import Api from '../store/system/api'
import Page from '../store/system/page'

const routerConf = {
  rootPath: '/system',
  routers: [
    { path: '', exact: true, component: JumpToOne },
    { path: 'table', store: Table, pages: { add: {}, edit: {}, detail: {}, list: {} } },
    { path: 'dict', store: Dict, pages: { add: {}, edit: {}, detail: {}, list: {} } },
    { path: 'api', store: Api, pages: { add: {}, edit: {}, detail: {}, list: {} } },
    { path: 'page', store: Page, pages: { add: {}, edit: {}, detail: {}, list: {} } },
  ]
}

export default class System extends Component {
  render() {
    return <LeftSider><RenderRoute {...routerConf}/></LeftSider>
  }
}

