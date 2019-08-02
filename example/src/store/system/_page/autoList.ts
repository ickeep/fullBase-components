import { Curd, Form, } from 'fullbase-components'
import IStore from 'fullbase-components/dist/store/_i'
import { observable, action } from 'mobx'
import Http, { HttpMap } from '../../../api/http'
import { getMap as getApiMap } from '../../../api/system/dict'
import Column from './column'
import { typeProps } from './formMap'

const { dfDataPage } = Http
@Curd @Form
export default class Table implements IStore {
  @observable dict = {}
  @action
  getDict = async () => {
  }
  @action
  setDict = async (dict: string) => {
    const data = await getApiMap(dict)
    if (data.code === 0) {
      this.dict = { ...this.dict, ...data.data }
    }
  }

  @action
  setConf = (conf: any) => {
    const { apiUrl = '', apiMethod = 'get', whereConf = [], desc, tableConf = {}, dict = '' } = conf
    dict && this.setDict(dict)
    this.listFormConf.pageTitle = desc
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
        const { dfVAl, field, props = [], data, span, title, type } = where
        listForm[field] = dfVAl
        const propsObj: { [key: string]: any } = {}
        const propsMap = typeProps[type]
        props.forEach && props.forEach((prop: any) => {
          if (prop.key && propsMap[prop.key]) {
            propsObj[prop.key] = prop.val
          }
        })
        fields.push({ title, field, type, span, data, props: propsObj })
      })
      this.dfListForm = { ...this.dfListForm, ...listForm }
      this.setListForm({ ...this.dfListForm })
      // @ts-ignore
      this.listFormConf.fields = fields
    }
    if (tableConf && tableConf.columns) {
      const { scrollX, columns = [] } = tableConf
      if (scrollX > 0) {
        // @ts-ignore
        this.listTable.scroll.x = scrollX
      }
      const tbCols: any[] = []
      columns.forEach((item: any) => tbCols.push(Column(item)))
      // @ts-ignore
      this.listTable.columns = tbCols
    }
  }

  constructor(conf: any) {
    this.setConf(conf)
  }

  @action
  setListForm = (form: any) => {
    this.listForm = form
  }
  dataFn: { [key: string]: any } = {}

  @observable listData = { ...dfDataPage, data: { data: [] } }
  @observable listLoading = false
  dfListForm = { page: 1, pageSize: 20 }
  @observable listForm = { ...this.dfListForm }
  //
  // listInitData = () => {
  //   this.getDict()
  // }
  // listAddConf = { name: '添加API', url: '/system/api/add' }
  listFormConf = { pageTitle: '列表', fields: [] }
  listTable = {
    scroll: {},
    columns: []
  }
}
