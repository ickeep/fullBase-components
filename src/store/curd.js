import { action } from 'mobx'

const OrderMap = { ascend: 'ASC', descend: 'DESC', ASC: 'ascend', DESC: 'descend' }
export default function ({ successVal = 0, format = { errno: 'errno', errmsg: 'errmsg', data: 'data' } } = {}) {
  const dfFormat = format
  const dfSuccessVal = successVal
  return function (target, { successVal = dfSuccessVal, format = dfFormat } = {}) {
    target.prototype.getSortOrder = function (field, formName = 'list') {
      let order = ''
      const listForm = this[`${formName}Form`]
      const sorter = { field: listForm._sorterField, val: listForm._sorterVal }
      if (sorter.field === field) {
        order = OrderMap[sorter.val] || ''
      }
      return order
    }
    target.prototype.httpReq = async function ({ formName = '', url, form = {}, dfType = 'GET' } = {}) {
      const formConf = this[`${formName}FormConf`] || {}
      const httpType = formConf.httpType ? formConf.httpType.toUpperCase() : dfType
      const httpFnMap = {
        GET: this.httpGet,
        POST: this.httpPost,
        PUT: this.httpPut,
        DEL: this.httpDel,
      }
      const httpFn = typeof httpFnMap[httpType] === 'function' ? httpFnMap[httpType] : this.httpGet
      let reqUrl = url
      let reqOpt = Object.assign({}, form)
      const requestBeforeFn = this[`${formName}RequestBeforeFn`] // 在向服务器发送前，修改请求数据的钩子
      if (typeof requestBeforeFn === 'function') {
        const beforeObj = await requestBeforeFn.call(this, { url, form })
        reqUrl = beforeObj.url
        reqOpt = beforeObj.form
      }
      const httpData = await httpFn.call(this, reqUrl, reqOpt)
      const requestAfterFn = this[`${formName}RequestAfterFn`] // 服务端返回数据后，传递给store前，修改数据的钩子
      if (typeof requestAfterFn === 'function') {
        const afterObj = await requestAfterFn.call(this, { data: httpData, form: this[`${formName}Form`] })
        return afterObj.data
      }
      return httpData
    }

    target.prototype.getErrData = function (errno, errmsg) {
      const tmpObj = {}
      tmpObj[format.errno] = errno
      tmpObj[format.errmsg] = errmsg
      return tmpObj
    }

    // 添加
    target.prototype.add = action(async function ({ formName = 'add', url = this.apiUrl[formName] } = {}) {
      const check = this.checkStoreNorm({ formName, url })
      if (check[format.errno] !== successVal) {
        return check
      }
      const { form = {} } = check
      this[`${formName}Status`].loading = true
      const addData = await this.httpReq({ formName, url, form, dfType: 'POST' })
      this[`${formName}Status`].loading = false
      return addData
    })

    // 获取详情
    target.prototype.getDetail = action(async function ({ formName = 'detail', url = this.apiUrl[formName] } = {}) {
      const check = this.checkStoreNorm({ formName, url })
      if (check[format.errno] !== successVal) {
        this[`${formName}Data`] = Object.assign({}, check)
      } else {
        this[`${formName}Loading`] = true
        this[`${formName}Data`] = await this.httpReq({ formName, url, form: this[`${formName}Form`], dfType: 'GET' })
        this[`${formName}Loading`] = false
      }
      return this[`${formName}Data`]
    })

    // 编辑
    target.prototype.edit = action(async function ({ formName = 'edit', url = this.apiUrl[formName] } = {}) {
      const check = this.checkStoreNorm({ formName, url })
      if (check[format.errno] !== successVal) {
        return check
      }
      const { form = {} } = check
      this[`${formName}Status`].loading = true
      const editData = await this.httpReq({ formName, url, form, dfType: 'POST' })
      this[`${formName}Status`].loading = false
      return editData
    })

    // 获取列表
    target.prototype.getList = action(async function ({ formName = 'list', url = this.apiUrl[formName] } = {}) {
      this.resetListTable({ formName })
      const check = this.checkStoreNorm({ formName, url })
      if (check[format.errno] !== successVal) {
        this[`${formName}Data`] = check
      } else {
        const { form = {} } = check
        const opt = Object.assign({}, form)
        // 获取排序
        const sorterField = this[`${formName}Form`]._sorterField
        const sorterVal = this[`${formName}Form`]._sorterVal
        if (sorterField && sorterVal) {
          opt[`${sorterField}Order`] = sorterVal
        }
        delete opt._sorterField
        delete opt._sorterVal
        this[`${formName}Loading`] = true
        this[`${formName}Data`] = await this.httpReq({ formName, url, form: opt, dfType: 'GET' })
        this[`${formName}Loading`] = false
      }
      return this[`${formName}Data`]
    })

    target.prototype.resetListTable = action(function ({ formName = 'list' } = {}) {
      const listTable = this[`${formName}Table`]
      if (listTable && listTable.rowSelection)
        listTable.rowSelection.selectedRowKeys = []
    })

    // 列表导出
    target.prototype.exportList = action(async function ({ formName = 'list', url = this.apiUrl[`${formName}Export`] } = {}) {
      if (typeof this[`${formName}Form`] === 'undefined') {
        return this[`${formName}Data`] = this.getErrData(4003004, `${formName} 的 Loading, Data, Form 未定义`)
      } else {
        let opt = Object.assign({}, this[`${formName}Form`])
        delete opt.pageNum
        delete opt.pageSize
        let reqUrl = url
        const requestBeforeFn = this[`${formName}RequestBeforeFn`]
        if (typeof requestBeforeFn === 'function') {
          const tmpObj = await requestBeforeFn.call(this, { url, form: opt })
          reqUrl = tmpObj.url
          opt = tmpObj.form
        }
        // 获取排序
        const sorterField = this[`${formName}Form`]._sorterField
        const sorterVal = this[`${formName}Form`]._sorterVal
        if (sorterField && sorterVal) {
          opt[`${sorterField}Order`] = sorterVal
        }
        delete opt._sorterField
        delete opt._sorterVal
        const tempForm = document.createElement("form");
        const handleConf = this[`${formName}HandleConf`] || {}
        const { exportHttpType = 'post' } = handleConf
        tempForm.action = this.http.processUrl(reqUrl);
        tempForm.target = '_blank';
        tempForm.method = exportHttpType;
        tempForm.style.display = 'none';
        Object.keys(opt).forEach((key) => {
          const value = opt[key]
          if (typeof value !== 'undefined' && value !== 'undefined' && value !== '') {
            const itemEl = document.createElement('input');
            itemEl.name = key
            itemEl.value = value
            tempForm.appendChild(itemEl);
          }
        })
        document.body.appendChild(tempForm);
        tempForm.submit()
        tempForm.remove()
      }
    })

    // 查查 from 是否存在
    target.prototype.checkStoreNorm = function ({ formName = 'detail', url = '' } = {}) {
      if (!url) {
        return this.getErrData(403004, `this.apiUrl.${formName} 不能为空`)
      }
      const form = this[`${formName}Form`]
      if (!form) {
        return this.getErrData(403004, `Store 里的 ${formName}Form 未定义`)
      }
      const data = this[`${formName}Data`]
      if (!data) {
        return this.getErrData(403004, `Store 里的 ${formName}Data 未定义`)
      }
      const status = this[`${formName}Status`]
      const loading = this[`${formName}Loading`]
      if (/([dD]etail|[lL]ist)$/.test(formName) && typeof loading === 'function') {
        return this.getErrData(403004, `Store 里的 ${formName}Loading 未定义`)
      }
      if (/([aA]dd|[eE]dit)$/.test(formName) && typeof status === 'function') {
        return this.getErrData(403004, `Store 里的 ${formName}status 未定义`)
      }
      return { ...this.getErrData(successVal, ''), form, status, loading, data }
    }
  }
}
