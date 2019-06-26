import React, { Component } from 'react'
import { Curd, Form, Input, Select, Link } from 'fullbase-components'
import IStore, { IFormStatus, IAddFormConf } from 'fullbase-components/dist/store/_i'
import { observable, action, reaction } from 'mobx'
import { list, add, detail, edit } from '../../api/system/api'
import { rows as dbRows, tableRows } from '../../api/system/db'
import { getFields } from '../../api/system/table'
import { rows as serviceRows } from '../../api/system/service'
import { rows as dictRows, getMap } from '../../api/system/dict'
import Http from '../../api/http'

const { dfDataPage, dfDataObj } = Http
@Curd @Form
export default class Table implements IStore {
  dataFn = { list, add, detail, edit }
  @observable dict = {
    db: [],
    status: {},
    table: [],
    httpMethod: {},
    fields: [],
    service: [],
    on: ['HAS_ONE', 'HAS_MANY']
  }
  @action
  getDict = async () => {
    const data = await getMap('status,httpMethod,pageType,apiSide')
    if (data.code === 0) {
      this.dict = { ...this.dict, ...data.data }
    }
  }
  @action
  getDbRows = async () => {
    if (!this.dict.db || this.dict.db.length < 1) {
      const data = await dbRows()
      if (data.code === 0) {
        this.dict.db = data.data
      }
    }
  }
  @action
  getServiceRows = async () => {
    if (!this.dict.service || this.dict.service.length < 1) {
      const data = await serviceRows()
      if (data.code === 0) {
        this.dict.service = data.data
      }
    }
  }
  @observable listData = { ...dfDataPage, data: { data: [] } }
  @observable listLoading = false
  dfListForm = { tableLike: '', page: 1, pageSize: 10 }
  @observable listForm = { ...this.dfListForm }

  listInitData = () => {
    this.getDict()
    this.getDbRows()
    this.getServiceRows()
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
      { title: '查询字段', dataIndex: 'whereFields' },
      { title: '排序字段', dataIndex: 'orderFields' },
      { title: '返回字段', dataIndex: 'fields' },
      { title: '表', dataIndex: 'table' },
      { title: '端', dataIndex: 'side' },
      { title: '备注', dataIndex: 'desc' },
    ]
  }
  dfAddForm = {
    url: '',
    table: '',
    db: '',
    desc: '',
    service: '',
    status: 1,
    fields: '',
    whereFields: '',
    orderFields: '',
    side: 'admin',
    method: 'get'
  }
  @observable addForm = { ...this.dfAddForm }
  @observable addErrs = { table: '', db: '', service: '' }
  @observable addStatus: IFormStatus = { submit: false, loading: false }
  @observable addData = { ...dfDataObj }
  addInitData = () => {
    this.getDict()
    this.getDbRows()
    this.getServiceRows()
  }
  @observable
  addFormConf: IAddFormConf = {
    pageTitle: '添加API',
    fields: [
      { title: 'url', field: 'url', type: 'input', span: 8, },
      { title: '数据库', field: 'db', type: 'select', data: 'db', span: 8, rules: 'required', },
      { title: '表名', field: 'table', type: 'select', data: 'table', span: 8, rules: 'required', },
      {
        title: '服务', field: 'service', type: 'select', data: 'service', span: 8, rules: 'required',
        props: { valKey: 'name' }
      },
      { title: '页面类型', field: 'type', type: 'select', data: 'pageType', span: 8, },
      { title: '端', field: 'side', type: 'select', data: 'apiSide', span: 8, },
      { title: '请求方式', field: 'method', type: 'select', data: 'httpMethod', span: 8, },
      {
        title: '查询字段', field: 'whereFields', span: 8, type: 'select', data: 'fields',
        props: { mode: 'multiple', valKey: 'name' }
      },
      {
        title: '排序字段', field: 'orderFields', span: 8, type: 'select', data: 'fields',
        props: { mode: 'multiple', valKey: 'name' }
      },
      {
        title: '返回字段', field: 'fields', span: 8, type: 'select', data: 'fields',
        props: { mode: 'multiple', valKey: 'name' }
      },
      { title: '状态', field: 'status', type: 'select', data: 'status', span: 8, },
      { title: '备注', field: 'desc', type: 'input', span: 8, },
    ]
  }

  dbReaction = reaction(() => this.addForm.db, async (db: string) => {
    this.addForm.table = ''
    this.dict.table = []
    if (db) {
      const data = await tableRows(db)
      if (data.code === 0) {
        this.dict.table = data.data
      }
    }
  })
  tableReaction = reaction(() => this.addForm.table, async (table: string) => {
    this.dict.fields = []
    this.addForm.fields = ''
    this.addForm.whereFields = ''
    this.addForm.orderFields = ''
    if (table) {
      const data = await getFields({ db: this.addForm.db, name: table })
      if (data.code === 0) {
        this.dict.fields = data.data
      }
    }
  })
  editInitData = () => {
    this.getServiceRows()
  }
  @observable detailData = { ...dfDataObj }
  @observable detailLoading = false
  @observable detailForm = { id: '' }
  @observable editForm = { ...this.dfAddForm }
  @observable editErrs = { ...this.addErrs }
  @observable editStatus = { ...this.addStatus }
  @observable editData = { ...this.addData }
  @observable editFormConf = {
    pageTitle: '编辑表配置',
    fields: [
      { title: '数据库', field: 'db', type: 'input', span: 8, props: { disabled: true } },
      { title: '表名', field: 'table', type: 'input', span: 8, props: { disabled: true } },
      {
        title: '服务', field: 'service', type: 'select', data: 'service', span: 8, rules: 'required',
        props: { valKey: 'name' }
      },

      {
        title: '云文件', field: 'cloudFields', span: 8, type: 'select', data: 'fields',
        props: { mode: 'multiple', valKey: 'name' }
      },
      { title: '备注', field: 'desc', type: 'input', span: 8, },
    ]
  }

}
