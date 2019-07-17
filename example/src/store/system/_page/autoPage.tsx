import React, { Component } from 'react'

class AutoPage extends Component<any> {
  render() {
    const { conf } = this.props
    console.log(conf);
    const { type } = conf
    if (type === 'list') {

    }
    return <div>autoPage {conf.type}</div>
  }
}

export default AutoPage
