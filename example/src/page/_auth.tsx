import React, { Component } from 'react'
import { Redirect, Route, Switch, withRouter, RouteComponentProps } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Spin } from 'antd'
import { SetSite } from 'fullbase-components'
import Login from '../page/login'
import Reset from '../page/reset'
import routes from '../route/_index'
import UI, { IUI } from '../store/ui'
import Auth, { IAuth } from '../store/auth'
import Config from '../config'

const { apiFormat: { code }, codeSuccess } = Config

@inject('UI') @observer
class AuthPage extends Component<{ UI?: IUI } & RouteComponentProps> {
  componentDidMount() {
    // const { UI: { setLocation } = UI, history: { location, listen } } = this.props
    // setLocation(location)
    // listen((l) => setLocation(l))

  }

  UNSAFE_componentWillReceiveProps(nextProps: { UI?: IUI } & RouteComponentProps) {
    const newUrl = nextProps.location.pathname + nextProps.location.search
    const oldUrl = this.props.location.pathname + this.props.location.search
    if (newUrl !== oldUrl) {
      UI.setPageTitle('')
    }
  }

  render() {
    const { UI: { pageTitle, site } = UI } = this.props

    return (
      <div id="page">
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/reset" component={Reset}/>
          <Route path="/" component={IndexPage}/>
        </Switch>
        <SetSite pageTitle={pageTitle} site={site}/>
      </div>
    )
  }
}

interface IProps {
  UI?: IUI,
  Auth?: IAuth
}

@inject('UI', 'Auth') @observer
class IndexPage extends Component<IProps & RouteComponentProps> {
  constructor(props: IProps & RouteComponentProps) {
    super(props)
    this.checkAuth()
  }

  async checkAuth() {
    const { Auth: { user: { id }, getInfo } = Auth, UI: { initData } = UI } = this.props
    if (!(id > 0)) {
      const userData = await getInfo()
      if (userData[code] === codeSuccess) {
        initData()
      }
    } else {
      initData()
    }
  }

  UNSAFE_componentWillReceiveProps(props: RouteComponentProps) {
    const { location: { pathname, search } } = props
    const { pathname: oldPathname, search: oldSearch } = this.props.location
    pathname !== oldPathname && UI.setPageTitle('')
    ;(pathname + search !== oldPathname + oldSearch) && this.checkAuth()
  }

  render() {
    const { Auth: { infoLoading, user: { id } } = Auth } = this.props
    if (infoLoading) {
      return (<div id="p-auth"><Spin tip="Loading..."/></div>)
    }
    if (!(id > 0)) {
      return (<Redirect to="/login"/>)
    }
    return (
      <Switch>
        {routes.map(route => (
          <Route key={route.path} {...route}/>
        ))}
      </Switch>
    )
  }
}

export default withRouter(AuthPage)

