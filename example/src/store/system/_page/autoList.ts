import { Curd, Form, } from 'fullbase-components'
import IStore from 'fullbase-components/dist/store/_i'
import { observable, action } from 'mobx'
import Http, { HttpMap } from '../../../api/http'

const { dfDataPage } = Http
@Curd @Form
export default class Table implements IStore {
  constructor(conf: any) {
    console.log('class', conf);
    const { apiUrl = '', apiMethod = 'get', whereConf = [], desc, tableConf = {} } = conf
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
        const { dfVAl, field, props = [], span, title, type } = where
        listForm[field] = dfVAl
        fields.push({ title, field, type, span })
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
      columns.forEach((item: any) => {
        const { align = "", dataIndex = "", expression = "", field = "api", fixed = "", props = [], rule = "", type = "", width = 200 } = item
        const tmpCol: { [key: string]: any } = { title: field, dataIndex: field || dataIndex }
        if (width > 0) {
          tmpCol.width = width
        }
        tbCols.push(tmpCol)
      })
      // @ts-ignore
      this.listTable.columns = tbCols
    }
  }

  @action
  setListForm = (form: any) => {
    this.listForm = form
  }
  dataFn: { [key: string]: any } = {}
  @observable dict = {}
  // @action
  // getDict = async () => {
  //   const data = await getMap('status,httpMethod,apiType,apiSide,yesOrNo')
  //   if (data.code === 0) {
  //     this.dict = { ...this.dict, ...data.data }
  //   }
  // }
  //
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
