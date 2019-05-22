import { action } from 'mobx'

// 添加
interface ICURDOpt {
  formName?: string,
  dataFn?: Function
}

export interface ICURD<T> {
  add: (opt?: ICURDOpt) => Promise<T>
  getDetail: (opt?: ICURDOpt) => Promise<T>
  edit: (opt?: ICURDOpt) => Promise<T>
  getList: (opt?: ICURDOpt) => Promise<T>
  downBolb: (bolb: any, name: string) => void
}

const OrderMap = { ascend: 'ASC', descend: 'DESC', ASC: 'ascend', DESC: 'descend' }
export default function ({ successErrno = 0, format = { errno: 'errno', errmsg: 'errmsg', data: 'data' } } = {}) {
  const dfFormat = format
  const dfSuccessErrno = successErrno
  return function <T extends { new(...args: any[]): { dataFn: { [key: string]: Function } } }>(target: T, { successErrno = dfSuccessErrno, format = dfFormat } = {}) {

    return class Curd extends target implements ICURD<any> {
      getSortOrder = (field: string, formName = 'list') => {
        let order = ''
        const listForm = this[`${formName}Form`]
        const sorter = { field: listForm._sorterField, val: listForm._sorterVal }
        if (sorter.field === field) {
          order = OrderMap[sorter.val] || ''
        }
        return order
      }
      getErrData = (errno: number, errmsg: string | { [key: string]: any }) => {
        const tmpObj = { form: {}, data: {} }
        tmpObj[format.errno] = errno
        tmpObj[format.errmsg] = errmsg
        errno !== successErrno && console.error(tmpObj)
        return tmpObj
      }

      checkStoreNorm = ({ formName = 'detail', dataFn }: ICURDOpt = {}) => {
        if (typeof dataFn !== 'function') {
          return this.getErrData(403004, `this.dataFn.${formName} 必须是一个方法`)
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
        if (/([dD]etail|[lL]ist)$/.test(formName) && typeof loading === 'undefined') {
          return this.getErrData(403004, `Store 里的 ${formName}Loading 未定义`)
        }
        if (/([aA]dd|[eE]dit)$/.test(formName) && typeof status === 'undefined') {
          return this.getErrData(403004, `Store 里的 ${formName}status 未定义`)
        }
        return { ...this.getErrData(successErrno, ''), form, status, loading, data }
      }

      executeDataFn = action(async ({ fn, form = {}, formName = '' }) => {

        const requestBeforeFn = this[`${formName}RequestBeforeFn`] // 在向服务器发送前，修改请求数据的钩子

        const tmpForm = typeof requestBeforeFn === 'function' ? await requestBeforeFn.call(this, form) : form
        const reqForm = {}
        const isQuery = /[Dd]etail|[Ll]ist|[Tt]ree$/.test(formName)
        Object.keys(tmpForm).forEach((key: any) => {
          const val = tmpForm[key]
          if (typeof val !== 'undefined' && !(isQuery && val === '')) {
            reqForm[key] = val
          }
        })
        const data = await fn(reqForm)
        const requestAfterFn = this[`${formName}RequestAfterFn`] // 服务端返回数据后，传递给store前，修改数据的钩子
        if (typeof requestAfterFn === 'function') {
          const afterObj = await requestAfterFn.call(this, { data, form })
          return afterObj.data
        }
        return data
      })
      add = action(async ({ formName = 'add', dataFn = this.dataFn[formName] }: ICURDOpt = {}) => {

        const check = this.checkStoreNorm({ formName, dataFn })
        if (check[format.errno] !== successErrno) {
          return check
        }
        const { form = {} } = check
        this[`${formName}Status`].loading = true
        const addData = await this.executeDataFn({ fn: dataFn, form, formName })
        this[`${formName}Status`].loading = false
        return addData
      })

      getDetail = action(async ({ formName = 'detail', dataFn = this.dataFn[formName] }: ICURDOpt = {}) => {
        const check = this.checkStoreNorm({ formName, dataFn })
        if (check[format.errno] !== successErrno) {
          this[`${formName}Data`] = Object.assign({}, check)
        } else {
          this[`${formName}Loading`] = true
          this[`${formName}Data`] = await this.executeDataFn({ fn: dataFn, form: check.form, formName })
          this[`${formName}Loading`] = false
        }
        return this[`${formName}Data`]
      })

      edit = action(async ({ formName = 'edit', dataFn = this.dataFn[formName] }: ICURDOpt = {}) => {
        const check = this.checkStoreNorm({ formName, dataFn })
        if (check[format.errno] !== successErrno) {
          return check
        }
        const { form = {} } = check
        this[`${formName}Status`].loading = true
        const editData = await this.executeDataFn({ fn: dataFn, form, formName })
        this[`${formName}Status`].loading = false
        return editData
      })

      resetListTable = action(({ formName = 'list' }: ICURDOpt = {}) => {
        const listTable = this[`${formName}Table`]
        if (listTable && listTable.rowSelection)
          listTable.rowSelection.selectedRowKeys = []
      })

      getList = action(async ({ formName = 'list', dataFn = this.dataFn[formName] }: ICURDOpt = {}) => {
        this.resetListTable({ formName })
        const check = this.checkStoreNorm({ formName, dataFn })
        if (check[format.errno] !== successErrno) {
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
          this[`${formName}Data`] = await this.executeDataFn({ fn: dataFn, form, formName })
          this[`${formName}Loading`] = false
        }
        return this[`${formName}Data`]
      })

      setListOperateStatus = action(({ name = 'list', status: { index, actionName, loading } }) => {
        const listOperateStatus = this[`${name}OperateStatus`]
        listOperateStatus && (listOperateStatus[`${actionName}-${index}`] = loading)
      })

      downBolb = (blob: any, name: string) => {
        var downloadElement = document.createElement('a')
        var href = window.URL.createObjectURL(blob)
        downloadElement.href = href
        downloadElement.download = name
        document.body.appendChild(downloadElement)
        downloadElement.click()
        document.body.removeChild(downloadElement)
        window.URL.revokeObjectURL(href)
      }
    }

    // 列表导出
    // target.prototype.exportList = action(async function ({ formName = 'list', url = this.apiUrl[`${formName}Export`] } = {}) {
    //   if (typeof this[`${formName}Form`] === 'undefined') {
    //     return this[`${formName}Data`] = this.getErrData(4003004, `${formName} 的 Loading, Data, Form 未定义`)
    //   } else {
    //     let opt = Object.assign({}, this[`${formName}Form`])
    //     delete opt.page
    //     delete opt.pageSize
    //     let reqUrl = url
    //     const requestBeforeFn = this[`${formName}RequestBeforeFn`]
    //     if (typeof requestBeforeFn === 'function') {
    //       const tmpObj = await requestBeforeFn.call(this, { url, form: opt })
    //       reqUrl = tmpObj.url
    //       opt = tmpObj.form
    //     }
    //     // 获取排序
    //     const sorterField = this[`${formName}Form`]._sorterField
    //     const sorterVal = this[`${formName}Form`]._sorterVal
    //     if (sorterField && sorterVal) {
    //       opt[`${sorterField}Order`] = sorterVal
    //     }
    //     delete opt._sorterField
    //     delete opt._sorterVal
    //     const tempForm = document.createElement("form");
    //     const handleConf = this[`${formName}HandleConf`] || {}
    //     const { exportHttpType = 'post' } = handleConf
    //     tempForm.action = this.http.processUrl(reqUrl);
    //     tempForm.target = '_blank';
    //     tempForm.method = exportHttpType;
    //     tempForm.style.display = 'none';
    //     Object.keys(opt).forEach((key) => {
    //       const value = opt[key]
    //       if (typeof value !== 'undefined' && value !== 'undefined' && value !== '') {
    //         const itemEl = document.createElement('input');
    //         itemEl.name = key
    //         itemEl.value = value
    //         tempForm.appendChild(itemEl);
    //       }
    //     })
    //     document.body.appendChild(tempForm);
    //     tempForm.submit()
    //     tempForm.remove()
    //   }
    // })
  }
}