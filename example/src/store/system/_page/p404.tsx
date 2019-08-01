import React, { Component } from 'react'
import { Link, Svg, Loading } from 'fullbase-components'
import AutoPage from './autoPage'
import { detail } from '../../../api/system/page'

class P404 extends Component<any> {

  state: { loading: boolean, conf: { [key: string]: any } } = { loading: false, conf: {} }

  componentDidMount() {
    this.fetchData()
  }

  getPageConf = async () => {
    const { location = {} } = this.props
    const { pathname } = location
    const confData = await detail({ url: '/admin' + pathname })
    const { code, data } = confData
    if (code === 0) {
      this.setState({ conf: data })
    }
  }

  async fetchData() {
    this.setState({ loading: true })
    await this.getPageConf()
    this.setState({ loading: false })
  }

  // shouldComponentUpdate(nextProps: any, nextState: any) {
  //   const pathname = this.props.location.pathname
  //   const nextPathname = this.props.location.pathname
  //   if (nextPathname !== pathname) {
  //     console.log('pathname');
  //     return true
  //   }
  //   if (this.state.loading !== nextState.loading) {
  //     console.log('loading');
  //     return true
  //   }
  //   return false
  //   // console.log(this.props);
  //   // console.log(nextProps);
  //   // return true;
  // }

  render() {
    const { loading, conf } = this.state
    if (loading) {
      return <Loading isCenter/>
    }
    if (conf && conf.type) {
      return <AutoPage conf={conf}/>
    }
    return (
      <div id="p-404">
        <Svg src="404" className="u-icon"/>
        <Link href="/" className="u-link">返回首页</Link>
      </div>
    )
  }
}

export default P404
