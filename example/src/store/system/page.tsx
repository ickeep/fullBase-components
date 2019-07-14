import React, { Component } from 'react'
import { Curd, Form, Input, Select, Link } from 'fullbase-components'
import IStore, { IFormStatus, IAddFormConf } from 'fullbase-components/dist/store/_i'
import { observable, action, reaction } from 'mobx'
import { list, add, detail, edit } from '../../api/system/page'
import { rows as apiRows, detail as apiDetail } from '../../api/system/api'
import { detail as tableDetail } from '../../api/system/table'
import { rows as dbRows, tableRows } from '../../api/system/db'
import { getFields } from '../../api/system/table'
import { rows as serviceRows } from '../../api/system/service'
import { getMap } from '../../api/system/dict'
import Http from '../../api/http'
import WhereConf from './_page/whereConf'

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
    api: []
  }
  @action
  getDict = async () => {
    const data = await getMap('status,pageType,apiSide,yesOrNo')
    if (data.code === 0) {
      this.dict = { ...this.dict, ...data.data }
    }
  }
  @action
  getApiRows = async () => {
    const { type, side } = this.addForm
    if (type && side) {
      const data = await apiRows({ _limit: 0, type, side })
      if (data.code === 0) {
        this.dict.api = data.data
      }
    }
  }

  @observable listData = { ...dfDataPage, data: { data: [] } }
  @observable listLoading = false
  dfListForm = { tableLike: '', page: 1, pageSize: 10 }
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
    fields: '',
    isConf: 1,
    type: 'list',
    side: 'admin',
  }
  @observable addForm = { ...this.dfAddForm }
  @observable addErrs = { table: '', db: '', service: '' }
  @observable addStatus: IFormStatus = { submit: false, loading: false }
  @observable addData = { ...dfDataObj }
  addInitData = () => {
    this.getDict()
    this.getApiRows()
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
      { title: '备注', field: 'desc', type: 'input', span: 8, },
      { title: '查询配置', field: 'whereConf', span: 24, render: (item: any) => <WhereConf {...item}/> },
    ]
  }
  typeReaction = reaction(() => this.addForm.type, () => {
    this.addForm.api = ''
    this.getApiRows()
  })
  sideReaction = reaction(() => this.addForm.side, () => {
    this.addForm.api = ''
    this.getApiRows()
  })

  apiReaction = reaction(() => this.addForm.api, async (id: string) => {
    // this.addForm.table = ''
    this.dict.apiDetail = {}
    if (id) {
      const data = await apiDetail({ id })
      if (data.code === 0) {
        this.dict.apiDetail = data.data
        const { table } = data.data
        if (table !== this.dict.tableDetail.name) {
          this.dict.tableDetail = { name: '' }
          const tbData = await tableDetail({ name: data.data.table })
          if (tbData.code === 0) {
            this.dict.tableDetail = tbData.data
          }
        }
      } else {
        this.dict.tableDetail = { name: '' }
      }
    } else {
      this.dict.tableDetail = { name: '' }
    }
  })

  editInitData = this.addInitData
  @observable detailData = { ...dfDataObj }
  @observable detailLoading = false
  @observable detailForm = { id: '' }
  @observable editForm = { ...this.dfAddForm, id: '' }
  @observable editErrs = { ...this.addErrs }
  @observable editStatus = { ...this.addStatus }
  @observable editData = { ...this.addData }
  @observable editFormConf = { ...this.addFormConf }

}
