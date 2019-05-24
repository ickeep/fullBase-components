import React, { ComponentClass, FunctionComponent } from 'react'
import { Loading, P404 } from 'fullbase-components'
import Loadable from 'react-loadable'
import IndexPage from '../page/index'

const loading = () => <Loading isCenter={true}/>

const router: Array<{ exact?: boolean | undefined, path: string, component: ComponentClass | FunctionComponent }> = [
  { exact: true, path: '/', component: IndexPage },
  { path: '/system', component: Loadable({ loader: () => import('./system'), loading }) },
  { path: '*', component: P404 }
]
export default router

