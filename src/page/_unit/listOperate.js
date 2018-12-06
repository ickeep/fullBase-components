import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Link from '../../_unit/link'
import { Button, Modal } from 'antd'

const confirm = Modal.confirm

@observer
export default class listOperate extends Component {
  render() {
    const { Store = {}, record, index, name = 'list' } = this.props
    const conf = Store[`${name}OperateConf`] || {}
    const listOperate = Store[`${name}Operate`]
    const { items = [] } = conf
    return (
      <div className="m-list-operate">
        {items.map && items.map((item, itemIndex) => {
          const { show, type, action = '', actionName, whom, urlFn, isConfirm } = item
          const isShow = show === true || (typeof  show === 'function' && show(record))
          if (!isShow) {
            return ''
          }
          const url = typeof urlFn === 'function' ? urlFn(record) : ''
          if (url) {
            return (<Link key={itemIndex} href={url}><Button type={type} size="small">{actionName}</Button></Link>)
          }
          const fnName = `${name}Operate${action.replace(/^\S/, s => s.toUpperCase())}`
          const fn = Store[fnName]
          if (typeof fn !== 'function') {
            return `找不到函数${fnName}`
          }
          return (<Operate
              key={itemIndex}
              type={type}
              action={action}
              isConfirm={isConfirm}
              actionName={actionName}
              whom={record[whom]}
              index={index}
              operate={listOperate}
              fn={() => fn.call(Store, { record, index, action })}
            />
          )
        })}
      </div>
    )
  }
}

@observer
class Operate extends Component {
  click = () => {
    const { fn = () => '', isConfirm = true, actionName, whom } = this.props
    if (isConfirm) {
      confirm({
        title: `${actionName}确认?`,
        content: `您确定要${actionName} ${whom}?`,
        onOk: () => fn(),
      });
    } else {
      fn()
    }
  }

  render() {
    const { operate = {}, index, action, type, actionName } = this.props
    return (
      <Button
        type={type}
        size="small"
        loading={operate.action === action && index === operate.index && operate.loading}
        onClick={this.click}>
        {actionName}
      </Button>
    )
  }
}
