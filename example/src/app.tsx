import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { ConfigContext } from 'fullbase-components'
import './app.less'
import AuthPage from './page/_auth'
import Auth from './store/auth'
import UI from './store/ui'
// import { rows } from './api/system/page'
// import AutoPage from './store/system/_page/autoPage'
import Http from "./api/http";
import config from "./config";

export default class extends Component {
  // state: { loading: boolean, conf: { [key: string]: any }, pages: any[] } = { loading: true, conf: {}, pages: [] }
  //
  // componentDidMount() {
  //   this.fetchData()
  // }
  //
  // getConf = async () => {
  //   const pageData = await rows({ _limit: 0 })
  //   const { code, data } = pageData
  //   if (code === 0) {
  //     this.setState({ pages: data })
  //   }
  // }
  //
  // async fetchData() {
  //   this.setState({ loading: true })
  //   await this.getConf()
  //   this.setState({ loading: false })
  // }

  render() {
    // const { loading, pages } = this.state
    // if (loading) {
    //   return <Loading isCenter/>
    // }
    return (
      <ConfigContext.Provider value={{ config, Http }}>
        <Provider Auth={Auth} UI={UI}>
          <Router>
            <LocaleProvider locale={zh_CN}>
              <AuthPage/>
            </LocaleProvider>
          </Router>
        </Provider>
      </ConfigContext.Provider>
    )
  }
}
