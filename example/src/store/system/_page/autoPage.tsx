import React, { Component } from 'react'
import { observer } from 'mobx-react'
import ListStore from './autoList'
import { List, Add, Edit, Detail } from 'fullbase-components'
import { withRouter } from 'react-router-dom'

const pageMap = { list: List, add: Add, edit: Edit, detail: Detail }

@observer
class AutoPage extends Component<any> {
  listStore = {}

  constructor(props: any) {
    super(props)
    this.listStore = new ListStore(this.props.conf)
  }

  componentDidUpdate(prevProps: any) {
    const pathname = this.props.location.pathname
    const nextPathname = prevProps.location.pathname
    if (nextPathname !== pathname) {
      this.listStore = new ListStore(this.props.conf)
    }
  }

  render() {
    const { conf } = this.props
    const { type } = conf
    const Page = pageMap[type]
    if (Page) {
      return <Page Store={this.listStore}/>
    }
    return <div>autoPage {conf.type}</div>
  }
}

export default withRouter(AutoPage)
