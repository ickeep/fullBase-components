import React from 'react'
import { Curd, Form, Link } from 'fullbase-components'
import IStore, { IFormStatus, IAddFormConf } from 'fullbase-components/dist/store/_i'
import { observable, action, reaction } from 'mobx'
import { list, add, detail, edit } from '../../api/system/page'
import { rows as apiRows, detail as apiDetail } from '../../api/system/api'
import { detail as tableDetail } from '../../api/system/table'
import { getMap, rows as dictRows } from '../../api/system/dict'
import Http from '../../api/http'
import WhereConf from './_page/whereConf'
import TableConf from './_page/tableConf'
import OperationConf from './_page/operationConf'
import AddConf from './_page/addConf'

const { dfDataPage, dfDataObj } = Http
@Curd @Form
export default class Table implements IStore {
  dataFn = { list, add, detail, edit }
  @observable dict = {
    db: [],
    status: {},
    apiDetail: {},
    tableDetail: { name: '' },
    table: [],
    httpMethod: {},
    fields: [],
    api: [],
    actionApi: [],
    dict: [],
  }
  @action
  getDict = async () => {
    const data = await getMap('status,pageType,apiSide,yesOrNo')
    if (data.code === 0) {
      this.dict = { ...this.dict, ...data.data }
    }
  }
  @action
  getApiRows = async (form: string) => {
    const { type, side } = this[form]
    if (type && side) {
      const data = await apiRows({ _limit: 0, type, side })
      if (data.code === 0) {
        this.dict.api = data.data
      }
    }
  }
  @action
  getDictRows = async () => {
    const data = await dictRows({ _limit: 0 })
    if (data.code === 0) {
      this.dict.dict = data.data
    }
  }

  @observable listData = { ...dfDataPage, data: { data: [] } }
  @observable listLoading = false
  dfListForm = { tableLike: '', page: 1, pageSize: 20 }
  @observable listForm = { ...this.dfListForm }

  listInitData = () => {
    this.getDict()
  }
  listAddConf = { name: '添加API', url: '/system/api/add' }
  listFormConf = {
    pageTitle: 'API列表',
    fields: [
      { title: 'url', field: 'urlLike', type: 'input', span: 8, },
      { title: '数据库', field: 'db', type: 'select', data: 'db', span: 8, props: { valKey: 'name' } },
      { title: '服务', field: 'service', type: 'select', data: 'service', span: 8, props: { valKey: 'name' } },
    ]
  }
  listTable = {
    dataKey: 'data',
    scroll: { x: 1100 },
    columns: [
      { title: 'ID', dataIndex: 'id', width: 80 },
      {
        title: 'url', dataIndex: 'url', width: 220,
        render: (v: string, r: any) => <Link href={`/system/api/detail?id=${r.id}`}>{v}</Link>
      },
      { title: '数据库', dataIndex: 'db' },
      { title: '服务', dataIndex: 'service' },
      { title: '查询字段', dataIndex: 'optFields' },
      { title: '排序字段', dataIndex: 'orderFields' },
      { title: '返回字段', dataIndex: 'fields' },
      { title: '表', dataIndex: 'table' },
      { title: '端', dataIndex: 'side' },
      { title: '备注', dataIndex: 'desc' },
    ]
  }
  dfAddForm = {
    api: '',
    url: '',
    desc: '',
    status: 1,
    isConf: 1,
    type: 'list',
    side: 'admin',
    whereConf: [],
    tableConf: {},
    addConf: {}
  }
  @observable addForm = { ...this.dfAddForm }
  @observable addErrs = { table: '', db: '', service: '' }
  @observable addStatus: IFormStatus = { submit: false, loading: false }
  @observable addData = { ...dfDataObj }
  addInitData = () => {
    this.getDict()
    this.getApiRows('addForm')
    this.getDictRows()
  }
  @observable
  addFormConf: IAddFormConf = {
    pageTitle: '添加页面',
    fields: [
      { title: '路径', field: 'url', type: 'input', span: 8, rules: 'required', },
      { title: '页面类型', field: 'type', type: 'select', data: 'pageType', span: 8, rules: 'required', },
      { title: '端', field: 'side', type: 'select', data: 'apiSide', span: 8, rules: 'required', },
      {
        title: '接口', field: 'api', type: 'select', data: 'api', span: 8, rules: 'required',
        props: { valKey: 'id', labelKey: 'desc', showSearch: true }
      },
      { title: '状态', field: 'status', type: 'select', data: 'status', span: 8, },
      { title: '是否配置', field: 'isConf', type: 'select', data: 'yesOrNo', span: 8, },
      {
        title: '字典', field: 'dict', type: 'select', data: 'dict', span: 8,
        props: { valKey: 'name', mode: 'multiple' }
      },
      { title: '备注', field: 'desc', type: 'input', span: 8, },
      { title: '查询配置', field: 'whereConf', span: 24, render: (item: any) => <WhereConf {...item}/> },
      { title: '表格配置', field: 'tableConf', span: 24, render: (item: any) => <TableConf {...item}/> },
      { title: '操作配置', field: 'operation', span: 24, render: (item: any) => <OperationConf {...item}/> },
      { title: '添加配置', field: 'addConf', span: 24, render: (item: any) => <AddConf {...item}/> },
    ]
  }
  typeReaction = reaction(() => this.addForm.type, () => {
    this.addForm.api = ''
    this.getApiRows('addForm')
  })
  sideReaction = reaction(() => this.addForm.side, () => {
    this.addForm.api = ''
    this.getApiRows('addForm')
  })

  @action
  getApiDetail = async (id: string) => {
    this.dict.apiDetail = {}
    if (id) {
      const data = await apiDetail({ id })
      if (data.code === 0) {
        this.dict.apiDetail = data.data
        const { table, type } = data.data
        if (table !== this.dict.tableDetail.name) {
          this.dict.tableDetail = { name: '' }
          const tbData = await tableDetail({ name: data.data.table })
          if (tbData.code === 0) {
            this.dict.tableDetail = tbData.data
          }
        }
        if (type === 'list') { // 列表页 获取操作 api
          const apiData = await apiRows({ _limit: 0, table, typeIn: 'freeze,unfreeze,del', })
          if (apiData.code === 0) {
            this.dict.actionApi = apiData.data
          }
        }
      } else {
        this.dict.tableDetail = { name: '' }
      }
    } else {
      this.dict.tableDetail = { name: '' }
    }
  }

  apiReaction = reaction(() => this.addForm.api, this.getApiDetail)

  editInitData = () => {
    this.getDict()
    this.getApiRows('editForm')
    this.getDictRows()
  }
  @observable detailData = { ...dfDataObj }
  @observable detailLoading = false
  @observable detailForm = { id: '' }
  @observable editForm = { ...this.dfAddForm, id: '' }
  @observable editErrs = { ...this.addErrs }
  @observable editStatus = { ...this.addStatus }
  @observable editData = { ...this.addData }
  @observable editFormConf = { ...this.addFormConf }

  editTypeReaction = reaction(() => this.editForm.type, () => {
    this.editForm.api = ''
    this.getApiRows('editForm')
  })
  editSideReaction = reaction(() => this.editForm.side, () => {
    this.editForm.api = ''
    this.getApiRows('editForm')
  })
  editApiReaction = reaction(() => this.editForm.api, this.getApiDetail)

}
