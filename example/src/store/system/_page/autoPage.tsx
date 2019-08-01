import React, { Component } from 'react'
import { observer } from 'mobx-react'
import ListStore from './autoList'
import { LeftSider, List } from 'fullbase-components'
import { withRouter } from 'react-router-dom'

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
    if (type === 'list') {
      return <List Store={this.listStore}/>
    }
    return <div>autoPage {conf.type}</div>
  }
}

export default withRouter(AutoPage)
