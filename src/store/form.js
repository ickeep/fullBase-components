import { action } from 'mobx'
import Validator from '../form/validator'
import XSS from 'xss'

const whiteList = XSS.whiteList
whiteList.embed = ['src', 'allowfullscreen', 'quality', 'width', 'height', 'align', 'type', 'allowscriptaccess']
Object.keys(whiteList).forEach(key => {
  whiteList[key].push('style')
})

export default function ({ whiteList = whiteList } = {}) {
  const dfWhiteList = whiteList
  return function (target, { whiteList = dfWhiteList } = {}) {
    const xss = XSS.FilterXSS({ whiteList })
    console.log(XSS);
    console.log(xss);
    target.prototype.xss = xss
    target.prototype.isSubmit = function (name) {
      let isSubmit = true
      const form = this[`${name}Form`]
      const status = this[`${name}Status`]
      const errs = this[`${name}Errs`]
      const rules = {}
      const formConf = this[`${name}FormConf`] || {}
      const { fields } = formConf
      if (fields) {
        fields.forEach((item) => {
          if (item.rules) {
            rules[item.field] = { rules: item.rules, aliasName: item.aliasName || item.title }
          }
        })
      }
      if (typeof status === 'object' && typeof form === 'object') {
        const errKeys = typeof errs === 'object' ? Object.keys(errs) : []
        for (let i = 0; i < errKeys.length; i += 1) {
          if (errs[errKeys[i]]) {
            isSubmit = false
            break
          }
        }
        const ruleKeys = typeof rules === 'object' ? Object.keys(rules) : []
        for (let i = 0; i < ruleKeys.length; i += 1) {
          const tmpKey = ruleKeys[i]
          const tmpRules = rules[tmpKey] ? rules[tmpKey].rules || '' : ''
          if (tmpRules.indexOf('required') >= 0 && (typeof form[tmpKey] === undefined || form[tmpKey] === '')) {
            isSubmit = false
            break
          }
        }
        status.submit = isSubmit
      }
    }

    target.prototype.setForm = action(function ({ name, valObj, isXss = true, trimType, isVerify = true } = {}) {
      const form = this[`${name}Form`]
      const rules = {}
      const formConf = this[`${name}FormConf`] || {}
      const { fields } = formConf
      if (isVerify && fields) {
        fields.forEach((item) => {
          if (item.rules) {
            rules[item.field] = { rules: item.rules, aliasName: item.aliasName || item.title, defined: item.defined }
          }
        })
      }
      const errs = this[`${name}Errs`]
      Object.keys(valObj).forEach((key) => {
        let tmpValue = valObj[key]
        if (form && typeof form[key] !== 'undefined') {
          tmpValue = (isXss && typeof tmpValue === 'string') ? xss.process(tmpValue) : tmpValue
          if (tmpValue && typeof tmpValue.replace === 'function') {
            if (trimType === 'left') {
              tmpValue = tmpValue.replace(/^[\s\uFEFF\xA0]+/, '')
            } else if (trimType === 'right') {
              tmpValue = tmpValue.replace(/[\s\uFEFF\xA0]+$/, '')
            } else if (trimType === true) {
              tmpValue.trim()
            }
          }
          form[key] = tmpValue
        }
        if (isVerify && rules && rules[key] && errs && typeof errs[key] !== 'undefined') {
          errs[key] = Validator.check(tmpValue, rules[key], form)
        }
      })
      this.isSubmit(name)
    })


    target.prototype.outHtml = function (content) {
      return { __html: xss.process(content) }
    }

    // 获取表单配置的字段
    target.prototype.getUrlParamsFieldArr = function ({ page = false, formName = 'list' } = {}) {
      const listForm = this[`${formName}Form`]
      const listFormConf = this[`${formName}FormConf`]
      if (typeof listForm !== 'object') {
        return []
      }
      let fieldArr = []
      if (typeof listFormConf === 'object') {
        if (page) {
          fieldArr.push('pageNum', 'currentPage', 'pageSize')
        }
        const { fields = [] } = listFormConf
        for (let i = 0; i < fields.length; i += 1) {
          const fieldObj = fields[i]
          if (fieldObj.field.indexOf(',') > 0) {
            fieldArr = fieldArr.concat(fieldObj.field.split(','))
          } else {
            fieldArr.push(fieldObj.field)
          }
        }
      } else {
        if (page) {
          fieldArr = fieldArr.concat(Object.keys(listForm))
        } else {
          const tmpObj = Object.assign({}, listForm)
          delete tmpObj.page
          delete tmpObj.pageSize
          fieldArr = fieldArr.concat(Object.keys(tmpObj))
        }
      }

      return fieldArr
    }

    // 根据配置字段 生成对应的查询URL
    target.prototype.getUrlParamsStr = function ({ formName = 'list', page = false, sorter = false } = {}) {
      if (typeof this[`${formName}Form`] !== 'object') {
        return ''
      }
      const searchParams = new URLSearchParams()
      const fieldArr = this.getUrlParamsFieldArr({ formName })
      const listFormConf = this[`${formName}FormConf`]
      const { emptyValSetUrl = [] } = listFormConf || {};
      if (page) {
        fieldArr.push('pageNum', 'currentPage', 'pageSize')
      }
      if (sorter) {
        fieldArr.push('_sorterField', '_sorterVal')
      }
      for (let j = 0; j < fieldArr.length; j += 1) {
        const field = fieldArr[j]
        const value = this[`${formName}Form`][field]
        if (!(typeof value === 'undefined' || (value === '' && emptyValSetUrl.indexOf(field) < 0))) {
          searchParams.set(field, value);
        }
      }
      return searchParams.toString()
    }

    target.prototype.getUrlParamsVal = function ({ fields = [], url } = {}) {
      const valObj = {}
      const searchParams = new URLSearchParams(url ? url.replace(/$\?/, '') : '')
      fields.forEach((key) => valObj[key] = searchParams.has(key) ? xss.process(searchParams.get(key)) : '')
      return valObj
    }

    // 根据URL 设置字段
    target.prototype.urlSetForm = function ({ name = 'list', url = '', isVerify = true } = {}) {
      const dfFormName = `df${name.replace(/^\S/, s => s.toUpperCase())}Form`
      const dfFormObj = this[dfFormName] || {}
      const formObj = this[`${name}Form`]
      const newForm = {}
      if (typeof formObj === 'object') {
        const searchParams = new URLSearchParams(url.replace(/$\?/, ''))
        Object.keys(formObj).forEach((key) => {
          if (searchParams.has(key)) {
            newForm[key] = xss.process(searchParams.get(key))
          }
        })
      }
      this.setForm({ name: name, valObj: { ...dfFormObj, ...newForm }, isVerify })
    }
  }
}
