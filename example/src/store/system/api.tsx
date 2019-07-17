import React, { Component } from 'react'
import { Curd, Form, Input, Select, Link } from 'fullbase-components'
import IStore, {
  IFormStatus,
  IAddFormConf,
  IListOperateStatus,
  IListOperateConf,
  IListOperateActionOpt
} from 'fullbase-components/dist/store/_i'
import { observable, action, reaction } from 'mobx'
import { list, add, detail, edit, freeze, unfreeze, del } from '../../api/system/api'
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
    const data = await getMap('status,httpMethod,apiType,apiSide,yesOrNo')
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
      { title: '查询字段', dataIndex: 'optFields' },
      { title: '排序字段', dataIndex: 'orderFields' },
      { title: '返回字段', dataIndex: 'fields' },
      { title: '表', dataIndex: 'table' },
      { title: '端', dataIndex: 'side' },
      { title: '备注', dataIndex: 'desc' },
    ]
  }
  @action
  enableItem = async ({ record }: IListOperateActionOpt) => {
    const enableData = await unfreeze({ id: record.id })
    enableData.code === 0 ? record.status = 1 : ''
  }
  @action
  disableItem = async ({ record }: IListOperateActionOpt) => {
    const disableData = await freeze({ id: record.id })
    disableData.code === 0 ? record.status = 0 : ''
  }
  @action
  delItem = async ({ record, index }: IListOperateActionOpt) => {
    const delData = await del({ id: record.id })
    // @ts-ignore
    delData.code === 0 && this.listData.data.records.splice(index, 1)
  }
  isEnable = (r: { status: number }): boolean => {
    return r && r.status === 1
  }

  @observable listOperateStatus: IListOperateStatus = {}

  listOperateConf: IListOperateConf = {
    props: { width: 260 },
    items: [
      {
        show: (r: any) => !this.isEnable(r),
        props: { type: 'primary', },
        action: this.enableItem,
        actionName: '启用',
        whom: 'desc',
        isConfirm: true
      },
      {
        show: (r: any) => this.isEnable(r),
        props: { type: 'danger', },
        action: this.disableItem,
        actionName: '停用',
        whom: 'desc',
        isConfirm: true
      },
      {
        show: true,
        props: { type: 'danger', },
        action: this.delItem,
        actionName: '删除',
        whom: 'desc',
        isConfirm: true
      }
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
    optFields: '',
    orderFields: '',
    isConf: 1,
    type: 'list',
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
      { title: 'url', field: 'url', type: 'input', span: 8, rules: 'required', },
      { title: '数据库', field: 'db', type: 'select', data: 'db', span: 8, rules: 'required', },
      { title: '表名', field: 'table', type: 'select', data: 'table', span: 8, rules: 'required', },
      {
        title: '服务', field: 'service', type: 'select', data: 'service', span: 8, rules: 'required',
        props: { valKey: 'name' }
      },
      { title: '类型', field: 'type', type: 'select', data: 'apiType', span: 8, rules: 'required', },
      { title: '端', field: 'side', type: 'select', data: 'apiSide', span: 8, rules: 'required', },
      { title: '请求方式', field: 'method', type: 'select', data: 'httpMethod', span: 8, rules: 'required', },
      {
        title: '参数字段', field: 'optFields', span: 8, type: 'select', data: 'fields',
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
      { title: '是否配置', field: 'isConf', type: 'select', data: 'yesOrNo', span: 8, },
      { title: '备注', field: 'desc', type: 'input', span: 8, },
    ]
  }

  @action
  dbEffect = async (db: string, form: string) => {
    this[form].table = ''
    this.dict.table = []
    if (db) {
      const data = await tableRows(db)
      if (data.code === 0) {
        this.dict.table = data.data
      }
    }
  }

  @action
  tableEffect = async (table: string, form: string) => {
    this.dict.fields = []
    this[form].fields = ''
    this[form].optFields = ''
    this[form].orderFields = ''
    if (table) {
      const data = await getFields({ db: this[form].db, name: table })
      if (data.code === 0) {
        this.dict.fields = data.data
      }
    }
  }
  dbReaction = reaction(() => this.addForm.db, (db: string) => this.dbEffect(db, 'addForm'))
  tableReaction = reaction(() => this.addForm.table, async (table: string) => this.tableEffect(table, 'addForm'))
  editInitData = this.addInitData
  @observable detailData = { ...dfDataObj }
  @observable detailLoading = false
  @observable detailForm = { id: '' }
  @observable editForm = { ...this.dfAddForm, id: '' }
  @observable editErrs = { ...this.addErrs }
  @observable editStatus = { ...this.addStatus }
  @observable editData = { ...this.addData }
  @observable editFormConf = { ...this.addFormConf }
  editDbReaction = reaction(() => this.editForm.db, (db: string) => this.dbEffect(db, 'editForm'))
  editTableReaction = reaction(() => this.editForm.table, async (table: string) => this.tableEffect(table, 'editForm'))
}
