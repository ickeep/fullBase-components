import React, { Component } from 'react'
import { observer } from 'mobx-react'
import ListStore from './autoList'
import { List } from 'fullbase-components'

@observer
class AutoPage extends Component<any> {
  render() {
    const { conf } = this.props
    const { type } = conf
    if (type === 'list') {
      const listStore = new ListStore(conf)
      return <List Store={listStore}/>
    }
    return <div>autoPage {conf.type}</div>
  }
}

export default AutoPage
