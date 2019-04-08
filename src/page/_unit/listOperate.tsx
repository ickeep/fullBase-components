import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Link from '../../display/link'
import { Button, Modal } from 'antd'

const confirm = Modal.confirm

@observer
export default class listOperate extends Component<{ Store?: object, record?: any, index?: number, name?: string, value?: any }> {
  render() {
    const { Store = {}, record, index = 0, name = 'list', value } = this.props
    const conf = Store[`${name}OperateConf`] || {}
    const listOperateStatus = Store[`${name}OperateStatus`]
    const { items = [] } = conf
    return (
      <div className="m-list-operate">
        {items.map && items.map((item: any, itemIndex: number) => {
          const { show, action, actionName, whom, urlFn, isConfirm, props = {} } = item
          const isShow = typeof show === 'function' ? show(record) : (show !== false)
          if (!isShow) {
            return ''
          }
          const url = typeof urlFn === 'function' ? urlFn(record) : ''
          if (url) {
            return (<Link key={itemIndex} href={url}><Button {...props} size="small">{actionName}</Button></Link>)
          }
          if (typeof action !== 'function') {
            return `action 必须是一个到函数`
          }
          return (<Operate
              Store={Store}
              name={name}
              key={itemIndex}
              btnProps={props}
              isConfirm={isConfirm}
              actionName={actionName}
              whom={record[whom]}
              index={index}
              operateStatus={listOperateStatus}
              fn={() => action.call(Store, { record, index, value })}
            />
          )
        })}
      </div>
    )
  }
}

@observer
class Operate extends Component<{ Store?: any, name: string, btnProps?: object, fn?: Function, isConfirm?: boolean, actionName?: string, whom?: string, index: number, operateStatus: object }> {
  execute = async () => {
    const { fn = () => '', Store, name, index, actionName } = this.props
    const setListOperateStatus = Store && Store.setListOperateStatus
    typeof setListOperateStatus === 'function' && setListOperateStatus({
      name,
      status: { index, actionName, loading: true }
    })
    await fn()
    typeof setListOperateStatus === 'function' && setListOperateStatus({
      name,
      status: { index, actionName, loading: false }
    })
  }
  click = () => {
    const { isConfirm = true, actionName, whom } = this.props
    if (isConfirm) {
      confirm({
        title: `${actionName}确认?`,
        content: `您确定要${actionName} ${whom}?`,
        onOk: () => {
          this.execute()
        },
      });
    } else {
      this.execute()
    }
  }

  render() {
    const { operateStatus, index, actionName, btnProps = {} } = this.props
    return (
      <Button
        htmlType="button"
        size="small"
        loading={operateStatus && operateStatus[`${actionName}-${index}`]}
        onClick={this.click}
        {...btnProps}
      >
        {actionName}
      </Button>
    )
  }
}
