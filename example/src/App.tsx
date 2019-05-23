import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import routes from './route'
import './app.less'
import Auth from './store/auth'
import UI from './store/ui'

class App extends Component {
  render() {
    return (
      <Provider Auth={Auth} UI={UI}>
        <Router>
          <LocaleProvider locale={zh_CN}>
            <Switch>
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

export default App
