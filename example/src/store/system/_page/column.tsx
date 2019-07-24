import React, { Component } from 'react'
import { observer } from 'mobx-react'
import DisplayMap, { typeProps } from './displayMap'
import Analyze from './analyzeVal'

export default function (conf: any) {
  const { align = '', dataIndex = '', field = 'api', title = '', fixed = '', props = [], type = '', width } = conf
  const tmpCol: { [key: string]: any } = { title, dataIndex: field || dataIndex }
  if (width > 0) {
    tmpCol.width = width
  }
  if (type) {
    const C = DisplayMap[type]
    if (C) {
      tmpCol.render = (v: any, r: any, index: number) => {
        const propsObj = typeProps[type]
        const colProps: any = {}
        if (propsObj.value) {
          colProps.value = v
        } else if (propsObj.children) {
          colProps.children = v
        }
        if (props && props.length > 0) {
          props.forEach((propCnf: any) => {
            const { key, val, rule, expression } = propCnf
            if (propsObj[key]) {
              colProps[key] = rule ? Analyze({ v, r, index, rule, expression }) : val
            }
          })
        }
        return <C {...colProps}/>
      }
    }
  }
  return tmpCol
}

