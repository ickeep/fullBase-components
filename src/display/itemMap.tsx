import React, { ReactNode } from 'react'
import { Button, Divider, Progress, Tooltip, Avatar } from "antd";
import Datetime from "./datetime";
import DetailGrid from "../page/_unit/detailGrid";
import PhoneEncrypt from "./phoneEncrypt";
import IdCardEncrypt from "./idCardEncrypt";
import Currency from "./currency";

function ADC(C: ReactNode, opt: { valProp?: string, dataProp?: string } = {}) {
  const { valProp = 'children', dataProp = '' } = opt
  return (props: any) => {
    const { value, data, ...oldProps } = props
    const newProps = {}
    newProps[valProp || 'children'] = value
    if (dataProp) {
      newProps[dataProp] = data
    }
    // @ts-ignore
    return <C  {...oldProps} {...newProps}/>
  }

}

export default {
  button: ADC(Button),
  avatar: ADC(Avatar, { valProp: 'src' }),
  tooltip: Tooltip,
  tag: AdTab,
  progress: Progress,
  divider: Divider,
  table: AdTable,
  datetime: Datetime,
  detailGrid: DetailGrid,
  phoneEncrypt: PhoneEncrypt,
  idCardEncrypt: IdCardEncrypt,
  currency: Currency,
}

