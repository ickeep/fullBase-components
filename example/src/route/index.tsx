import React, { ComponentClass, FunctionComponent } from 'react'
import { Loading } from 'fullbase-components'
import Loadable from 'react-loadable'
import IndexPage from '../page/index'
// import p404Page from '../page/p404'


const router: Array<{ exact?: boolean | undefined, path: string, component: ComponentClass | FunctionComponent }> = [
  { exact: true, path: '/', component: IndexPage },
  // { path: '/rbac', component: Loadable({ loader: () => import('./rbac'), loading: Loading }) },
  // { path: '/agency', component: Loadable({ loader: () => import('./agency'), loading: Loading }) },
  // { path: '/user', component: Loadable({ loader: () => import('./user'), loading: Loading }) },
  // { path: '/content', component: Loadable({ loader: () => import('./content'), loading: Loading }) },
  // { path: '*', component: p404Page }
]
export default router

