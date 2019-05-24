import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import StoreRoute from './storeRoute'
import P404 from "../page/p404";

export interface IProps {
  rootPath: string,
  routers: any[]
}

export default class RenderRoute extends Component<IProps> {
  router: any = null

  constructor(props: any) {
    super(props)
    const { rootPath, routers } = this.props
    const arr: any[] = []
    routers.forEach((item: any) => {
      item.path = rootPath + (item.path ? '/' + item.path : '')
      if (item.store && item.pages) {
        arr.push({ path: item.path, component: () => <StoreRoute {...item}/> })
      } else {
        arr.push(item)
      }
    })
    arr.push({ path: '*', component: P404 })
    this.router = (
      <Switch>
        {arr.map(route => (
          <Route key={route.path} {...route}/>
        ))}
      </Switch>
    )
  }

  render(): React.ReactNode {
    return this.router
  }
}
