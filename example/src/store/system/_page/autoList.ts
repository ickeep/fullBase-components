import { Curd, Form, } from 'fullbase-components'
import IStore, { IListOperateActionOpt, IListOperateStatus } from 'fullbase-components/dist/store/_i'
import { observable, action } from 'mobx'
import Http, { HttpMap } from '../../../api/http'
import { getMap as getApiMap } from '../../../api/system/dict'
import { rows as apiRows } from '../../../api/system/api'
import Column from './column'
import { typeProps } from './formMap'
import { handleProps } from './propsEdit'
import Analyze from "./analyzeVal";

const { dfDataPage, httpPost } = Http
@Curd @Form
export default class Table implements IStore {
  @observable dict: { [key: string]: any } = {}
  @action
  getDict = async () => {
  }
  @action
  setDict = async (dict: string, dictApi: any[]) => {
    const self = this
    getApiMap(dict).then((data: any) => {
      if (data.code === 0) {
        self.dict = { ...self.dict, ...data.data }
      }
    })
    if (dictApi && dictApi.forEach) {
      const apiIdArr: any[] = []
      const apiOptArr: any[] = []
      const keyArr: string[] = []
      dictApi.forEach((item: any) => {
        apiIdArr.push(item.api)
        keyArr.push(item.key)
        const tmpOpt = {}
        item.opt && item.opt.forEach && item.opt.forEach(({ key, val }: any) => {
          tmpOpt[key] = val
        })
        apiOptArr.push(tmpOpt)
      })
      const apiArrData = await apiRows({ _limit: 0, idIn: apiIdArr.join(',') })
      const apiMap = {}
      if (apiArrData.code === 0) {
        apiArrData.data && apiArrData.data.forEach((apiDetail: any) => {
          apiMap[apiDetail.id] = apiDetail
        })
      }
      for (let i = 0; i < apiIdArr.length; i += 1) {
        const apiDetail = apiMap[apiIdArr[i]] || {}
        const opt = apiOptArr[i]
        const key = keyArr[i]
        const { url, method } = apiDetail
        if (url) {
          const fn = HttpMap[method || 'get'] || HttpMap.get
          fn(url, opt).then((data: any) => {
            self.dict[key] = data.code === 0 ? data.data : []
          })
        }
      }
    }

  }

  @action
  setConf = (conf: any) => {
    const self = this
    const { apiUrl = '', apiMethod = 'get', breadcrumbConf = [], whereConf = [], desc, tableConf = {}, dict = '', operation, addConf = {}, dictApi = [] } = conf
    const rowKey = tableConf.rowKey || 'id'
    dict && this.setDict(dict, dictApi)
    this.listFormConf.pageTitle = desc
    if (breadcrumbConf && breadcrumbConf.length > 0) {
      this.listBreadcrumb = breadcrumbConf
    }
    if (addConf && addConf.url) {
      // @ts-ignore
      this.listAddConf = {
        name: addConf.name || '添加',
        url: addConf.url,
        props: handleProps(addConf.props, {}, 'button')
      }
    }
    const fn = HttpMap[apiMethod]
    if (typeof fn === 'function' && apiUrl) {
      this.dataFn.list = async (data: any) => {
        return await fn(apiUrl.replace(/^\/admin/, '/api'), data)
      }
    }
    if (whereConf && whereConf.forEach) {
      const listForm = {}
      const fields: any[] = []
      whereConf.forEach((where: any) => {
        const { dfVAl, field, props = [], data, span = 8, title, type } = where
        listForm[field] = dfVAl
        const propsObj: { [key: string]: any } = {}
        const propsMap = typeProps[type]
        props.forEach && props.forEach((prop: any) => {
          if (prop.key && propsMap[prop.key]) {
            propsObj[prop.key] = prop.val
          }
        })
        fields.push({ title, field, type, span: parseInt(span), data, props: propsObj })
      })
      this.dfListForm = { ...this.dfListForm, ...listForm }
      this.setListForm({ ...this.dfListForm })
      // @ts-ignore
      this.listFormConf.fields = fields
    }
    if (tableConf && tableConf.columns) {
      const { scrollX, columns = [], isRowSelection, rowSelection } = tableConf
      if (rowKey) {
        this.listTable.rowKey = rowKey
      }
      if (scrollX > 0) {
        // @ts-ignore
        this.listTable.scroll.x = scrollX
      }
      if (isRowSelection && rowSelection) {
        rowSelection.selectedRowKeys = typeof rowSelection.selectedRowKeys === 'string' ? rowSelection.selectedRowKeys.split(',') : []
        // @ts-ignore
        this.listTable.rowSelection = observable(rowSelection)
        // @ts-ignore
        this.listTable.rowSelection.selectedRowKeys = []
        // @ts-ignore
        this.listTable.rowSelection.onChange = action((keys: string[]) => {
          // @ts-ignore
          self.listTable.rowSelection.selectedRowKeys = keys
        })
        if (rowSelection.props && rowSelection.props.length > 0) {
          // @ts-ignore
          this.listTable.rowSelection.getCheckboxProps = (r: any) => {
            return handleProps(rowSelection.props, { r }, 'aCheckbox')
          }
        }
      }
      const tbCols: any[] = []
      columns.forEach((item: any) => tbCols.push(Column(item)))
      // @ts-ignore
      this.listTable.columns = tbCols
    }
    if (operation && operation.length > 0) {
      const tableOperationArr: any[] = []
      const batchOperationArr: any[] = []
      const actionFns: { [key: string]: any } = {}
      operation.forEach((item: any) => {
        const { name = '', isShow = '', isBatch = '', isShowRow, props = [], action: actionName = '', actionApi, actionOpt, whom = '', isConfirm = '', urlExpression = '' } = item
        const propsObj = handleProps(props, {}, 'button')
        if (isBatch) {
          if (!actionFns[`batch${actionName}`]) {
            actionFns[`batch${actionName}`] = async () => {
              if (rowKey === (actionOpt || 'id')) {
                // @ts-ignore
                const selectedRowKeys = self.listTable && self.listTable.rowSelection && self.listTable.rowSelection.selectedRowKeys || []
                const opts: { [key: string]: any } = {}
                opts[rowKey] = selectedRowKeys
                const data = await httpPost(actionApi, opts)
                if (data.code === 0) {
                  // @ts-ignore
                  self.getList()
                }
              }
            }
            batchOperationArr.push({
              actionName: name,
              action: actionFns[`batch${actionName}`],
              whom,
              isConfirm,
              props: propsObj
            })
          }
        }
        if (isShowRow) {
          if (!actionFns[actionName]) {
            actionFns[actionName] = action(async ({ record, index }: IListOperateActionOpt) => {
              const opts = {}
              ;(actionOpt || 'id').split(',').forEach((opt: string) => {
                opts[opt] = record[opt] || ''
              })
              const data = await httpPost(actionApi, opts)
              if (data.code === 0) {
                if (actionName === 'del') {
                  self.listData.data.data.splice(index, 1)
                }
                if (actionName === 'freeze' && self.listData.data.data[index]) {
                  // @ts-ignore
                  self.listData.data.data[index].status = 0
                }
                if (actionName === 'unfreeze' && self.listData.data.data[index]) {
                  // @ts-ignore
                  self.listData.data.data[index].status = 1
                }
              }
            })
          }
          const tmpObj: { [key: string]: any } = {
            actionName: name,
            action: actionFns[actionName],
            whom,
            isConfirm,
            props: propsObj
          }
          if (isShow.indexOf('<%') >= 0) {
            tmpObj.show = (r: any, index: number) => Analyze({
              data: {
                r,
                index
              },
              rule: 'template',
              expression: isShow
            }) === 'true'
          } else {
            tmpObj.show = !!isShow
          }
          if (urlExpression) {
            if (urlExpression.indexOf('<%') >= 0) {
              tmpObj.urlFn = (r: any, index: number) => Analyze({
                data: { r: r || {}, index },// 批量操作
                rule: 'template',
                expression: urlExpression
              })
            } else {
              tmpObj.urlFn = () => urlExpression
            }
          }
          tableOperationArr.push(tmpObj)
        }
      })
      if (tableOperationArr.length > 0) {
        const { actionProps = [] } = tableConf
        this.listOperateConf.props = handleProps(actionProps, {}, 'tableColumn')
      }
      this.listTableActions = batchOperationArr
      this.listOperateConf.items = tableOperationArr
    }
  }

  constructor(conf: any) {
    this.setConf(conf)
  }

  @action
  setListForm = (form: any) => {
    this.listForm = form
  }
  listBreadcrumb = []
  dataFn: { [key: string]: any } = {}
  @observable listOperateConf: { [key: string]: any } = {}
  @observable listOperateStatus: IListOperateStatus = {}

  @observable listData = { ...dfDataPage, data: { data: [] } }
  @observable listLoading = false
  dfListForm = { page: 1, pageSize: 20 }
  @observable listForm = { ...this.dfListForm }
  listFormConf = { pageTitle: '列表', fields: [] }
  listTable = {
    rowKey: 'id',
    scroll: {},
    columns: []
  }
  listTableActions: any[] = []
}
