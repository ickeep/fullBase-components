import React, { ComponentClass, FunctionComponent } from 'react'
import IndexPage from '../page/index'


const router: Array<{ exact?: boolean | undefined, path: string, component: ComponentClass | FunctionComponent }> = [
  { exact: true, path: '/', component: IndexPage },
]
export default router

