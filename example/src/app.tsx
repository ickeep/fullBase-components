import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
// import { Loading } from 'fullbase-components'
import routes from './route/_index'
import './app.less'
import Auth from './store/auth'
import UI from './store/ui'
// import { rows } from './api/system/page'
// import AutoPage from './store/system/_page/autoPage'

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
      <Provider Auth={Auth} UI={UI}>
        <Router>
          <LocaleProvider locale={zh_CN}>
            <Switch>
              {/*{pages.map((page) => (*/}
              {/*  <Route key={page.url} exact={true} path={page.url.replace(/^\/admin/, '')}*/}
              {/*         component={() => <AutoPage conf={page}/>}/>*/}
              {/*))}*/}
              {routes.map(route => (
                <Route key={route.path} {...route}/>
              ))}
            </Switch>
          </LocaleProvider>
        </Router>
      </Provider>
    )
  }
}
