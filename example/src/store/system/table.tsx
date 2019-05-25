import React, { Component } from 'react'
import { Checkbox } from 'antd'
import { observer } from 'mobx-react'
import { Curd, Form } from 'fullbase-components'
import IStore, { IFormStatus, IAddFormConf, IFields } from 'fullbase-components/dist/store/_i'
import { observable, action, reaction } from 'mobx'
import { list, getFields } from '../../api/system/table'
import { rows as dbRows, tableRows } from '../../api/system/db'
import Http from '../../api/http'

const { dfDataPage } = Http
@Curd @Form
export default class Table implements IStore {
  dataFn = { list }
  @observable dict = { db: [], name: [], fields: [] }
  @action
  getDbRows = async () => {
    if (!this.dict.db || this.dict.db.length < 1) {
      const data = await dbRows()
      if (data.code === 0) {
        this.dict.db = data.data
      }
    }
  }
  @observable listData = { ...dfDataPage, data: { data: [] } }
  @observable listLoading = false
  dfListForm = {
    id: '',
    status: '',
    nameLike: '',
    phoneLike: '',
    mailLike: '',
    gender: '',
    joinTimeMin: '',
    joinTimeMax: '',
    lastJoinTimeMin: '',
    lastJoinTimeMax: '',
    page: 1,
    pageSize: 10
  }
  @observable listForm = { ...this.dfListForm }

  // listInitData = () => this.initDict()
  listAddConf = { name: '添加数据表', url: '/system/table/add' }
  listFormConf = {
    pageTitle: '数据表列表',
    fields: [
      { title: 'ID', field: 'id', type: 'inputNumber', span: 8, props: { min: 0 } },
      { title: '名称', field: 'nameLike', type: 'input', span: 8 },
      { title: '状态', field: 'status', type: 'select', span: 8, data: 'status', props: { placeholder: '全部' } },
      { title: '手机', field: 'phoneLike', type: 'input', span: 8, },
      { title: '邮箱', field: 'mailLike', type: 'input', span: 8 },
      { title: '性别', field: 'gender', type: 'select', span: 8, data: 'gender', props: { placeholder: '全部' } },
      {
        title: '创建时间', field: 'joinTimeMin,joinTimeMax', type: 'rangeDate', span: 12,
        props: { valueType: 'timestamp', showTime: true, format: 'YYYY-MM-DD HH:mm:ss' }
      },
      {
        title: '最后登录', field: 'lastJoinTimeMin,lastJoinTimeMax', type: 'rangeDate', span: 12,
        props: { valueType: 'timestamp', showTime: true, format: 'YYYY-MM-DD HH:mm:ss' }
      }
    ]
  }
  listTable = {
    dataKey: 'data',
    scroll: { x: 1100 },
    columns: [
      {
        title: '用户名称', dataIndex: 'name', width: 220,
        // render: (v: string, r: any) => <Link href={`/rbac/user/detail?id=${r.id}`}>{v}</Link>
      },
      { title: '手机', dataIndex: 'phone' },
      { title: '邮箱', dataIndex: 'mail' },
      // { title: '性别', dataIndex: 'gender', render: (v: string) => this.dict.gender[v] || '' },
      // { title: '创建时间', dataIndex: 'joinTime', render: (v: number) => <Datetime value={v}/> },
      // { title: '最后登录', dataIndex: 'lastLoginTime', render: (v: number) => <Datetime value={v}/> },
    ]
  }
  dfAddForm = { name: '', db: '', dict: {}, fields: {}, join: {}, cloudFields: '', service: '' }
  @observable addForm = { ...this.dfAddForm }
  @observable addErrs = { name: '', db: '', service: '' }
  @observable addStatus: IFormStatus = { submit: false, loading: false }
  addInitData = () => {
    this.getDbRows()
  }
  @observable
  addFormConf: IAddFormConf = {
    pageTitle: '添加表配置',
    fields: [
      { title: '数据库', field: 'db', type: 'select', data: 'db', span: 12, rules: 'required', },
      { title: '表名', field: 'name', type: 'select', data: 'name', span: 12, rules: 'required', },
      { title: '字段', field: 'fields', span: 24, render: (item: any) => <RFields {...item}/> }
    ]
  }

  dbReaction = reaction(() => this.addForm.db, async (db: string) => {
    this.addForm.name = ''
    this.dict.name = []
    if (db) {
      const data = await tableRows(db)
      if (data.code === 0) {
        this.dict.name = data.data
      }
    }
  })
  nameReaction = reaction(() => this.addForm.name, async (name: string) => {
    this.dict.fields = []
    this.addForm.fields = {}
    if (name) {
      const data = await getFields({ db: this.addForm.db, name })
      if (data.code === 0) {
        this.dict.fields = data.data
        const conf = {}
        data.data.forEach((item: any) => {
          conf[item.name] = { like: true, notLike: true, in: true, num: true, not: true }
        })
        this.addForm.fields = conf
      }
    }
  })
}

@observer
class RFields extends Component<any> {
  change = (e: any, field: string, type: string) => {
    const { checked } = e.target
    const { value, onChange, values, field: pField } = this.props
    value[field][type] = checked
    values[pField] = value
    onChange(values)
  }

  render() {
    const { value } = this.props
    if (typeof value !== 'object') {
      return '请选择表，或者确定表有字段'
    }
    return <div>{Object.keys(value).map((field: any) => {
      const { like, notLike, in: fIn, num, not } = value[field];
      return (
        <div key={field}>
          <h3 style={{ display: 'inline-block', minWidth: '80px' }}>{field}:</h3>
          <Checkbox checked={like} onChange={(e) => this.change(e, field, 'like')}>like</Checkbox>
          <Checkbox checked={notLike} onChange={(e) => this.change(e, field, 'notLike')}>notLike</Checkbox>
          <Checkbox checked={fIn} onChange={(e) => this.change(e, field, 'in')}>in</Checkbox>
          <Checkbox checked={num} onChange={(e) => this.change(e, field, 'num')}>num</Checkbox>
          <Checkbox checked={not} onChange={(e) => this.change(e, field, 'not')}>not</Checkbox>
        </div>
      )
    })}</div>
  }
}
