import React, { Component } from 'react'
import { Redirect, withRouter } from 'react-router-dom'

export default function ({
                           successVal = 0,
                           authVal = 401100,
                           format = { errno: 'errno', errmsg: 'errmsg', data: 'data' }
                         } = {}) {
  const dfSuccessVal = successVal
  const dfAuthVal = authVal
  const dfFormat = format

  @withRouter
  class Content extends Component {
    render() {
      const { loading, errObj, children, location } = this.props
      const { errmsg, errno } = dfFormat
      const errArr = []
      if (typeof errObj[errmsg] === 'object') {
        Object.keys(errObj[errmsg]).forEach((key) => {
          errArr.push(errObj[errmsg][key])
        })
      } else {
        errArr.push(errObj[errmsg])
      }
      if (loading) {
        return (
          <div id="loading">loading……</div>
        )
      } else if (errObj[errno] !== dfSuccessVal) {
        if (errObj[errno] === dfAuthVal) {
          const { pathname, search } = location
          return (<Redirect to={`/login?referrer=${encodeURIComponent(pathname + search)}`}/>)
        } else {
          return (<div id="error">
            <h2>页面出错了：{errObj[errno]}</h2>
            <h4>错误信息：</h4>
            {errArr.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
            <p>请联系系统管理员 xxx </p>
          </div>)
        }
      } else {
        return children
      }
    }
  }

  return Content
}


