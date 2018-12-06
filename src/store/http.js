import Http from 'fullbase-axios'
import { notification } from 'antd'

export default function ({
                           hosts,
                           conf = { withCredentials: true },
                           beforeFn,
                           afterFn,
                           successVal = 0,
                           format = { errno: 'errno', errmsg: 'errmsg', data: 'data' },
                           pageData = { numsPerPage: '', currentPage: '', count: '', totalPages: '', data: [] }
                         } = {}) {
  const dfHosts = hosts
  const dfConf = conf
  const dfFormat = format
  const dfBeforeFn = beforeFn
  const dfAfterFn = afterFn
  const dfSuccessVal = successVal
  const dfPageDate = pageData
  return function (target, opt = {}) {
    const {
      hosts = dfHosts,
      conf = dfConf,
      beforeFn = dfBeforeFn,
      afterFn = dfAfterFn,
      successVal = dfSuccessVal,
      format = dfFormat,
      pageData = dfPageDate
    } = opt
    target.prototype.http = new Http({ trim: true, hosts, format, conf })
    const dfData = {}
    dfData[format.errno] = ''
    dfData[format.errmsg] = ''
    dfData[format.data] = ''
    target.prototype.dfData = dfData
    const dfDataObj = { ...dfData }
    dfDataObj[format.data] = {}
    target.prototype.dfDataObj = dfDataObj
    const dfDataArr = { ...dfData }
    dfDataArr[format.data] = []
    target.prototype.dfDataArr = dfDataArr
    const dfDataPage = { ...dfData }
    dfDataPage[format.data] = pageData
    target.prototype.dfDataPage = dfDataPage

    target.prototype.msgHandle = function (msg, data = {}) {
      if (msg) {
        const { errno, errmsg } = format
        if (data[errno] !== successVal) {
          const msgArr = []
          if (data[errmsg] && typeof data[errmsg] === 'object') {
            Object.keys(data[errmsg]).forEach((key) => {
              msgArr.push(data[errmsg][key])
            })
          } else {
            msgArr.push(data[errmsg])
          }
          notification.error({ message: data[errno], description: msgArr.join(',') })
        } else {
          notification.success({ message: typeof msg === 'string' ? msg : '操作成功' })
        }
      }
    }

    target.prototype.httpFn = async function (type, url, opt, msg, conf) {
      let data = {}
      if (beforeFn && typeof beforeFn === 'function') {
        const argObj = await httpBeforeFn({ url, opt, msg, conf })
        data = await this.http[type](argObj.url, argObj.opt, argObj.msg, argObj.conf)
      } else {
        data = await this.http[type](url, opt, msg, conf)
      }
      if (afterFn && typeof afterFn === 'function') {
        const afterData = await afterFn({ data })
        data = afterData.data
      }
      this.msgHandle(msg, data)
      return data
    }

    target.prototype.httpGet = function (url = '', opt = {}) {
      return this.httpFn('get', url, opt)
    }
    target.prototype.httpPost = async function (url, opt, msg = false, conf = {}) {
      return this.httpFn('post', url, opt, msg, conf)
    }
    target.prototype.httpDel = async function (url, opt, msg = false, conf) {
      return this.httpFn('del', url, opt, msg, conf)
    }
    target.prototype.httpPut = async function (url, opt, msg = false, conf) {
      return this.httpFn('put', url, opt, msg, conf)
    }
    target.prototype.httpPatch = async function (url, opt, msg = false, conf) {
      return this.httpFn('patch', url, opt, msg, conf)
    }
  }
}
