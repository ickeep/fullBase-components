import React, { Component } from 'react'
import { Checkbox, Button, Form as FormC, Row, Col } from 'antd'
import { observer } from 'mobx-react'
import { Curd, Form, Input, Select } from 'fullbase-components'
import IStore, { IFormStatus, IAddFormConf, IFields } from 'fullbase-components/dist/store/_i'
import { observable, action, reaction } from 'mobx'
import { list, getFields } from '../../api/system/table'
import { rows as dbRows, tableRows } from '../../api/system/db'
import { rows as serviceRows } from '../../api/system/service'
import Http from '../../api/http'

const { dfDataPage } = Http
@Curd @Form
export default class Table implements IStore {
  dataFn = { list }
  @observable dict = { db: [], name: [], fields: [], service: [], on: ['HAS_ONE', 'HAS_MANY'] }
  @action
  getDbRows = async () => {
    if (!this.dict.db || this.dict.db.length < 1) {
      const data = await dbRows()
      if (data.code === 0) {
        this.dict.db = data.data
      }
    }
  }
  getServiceRows = async () => {
    if (!this.dict.db || this.dict.service.length < 1) {
      const data = await serviceRows()
      if (data.code === 0) {
        this.dict.service = data.data
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
  dfAddForm = { name: '', db: '', dict: {}, fields: {}, join: [], cloudFields: '', service: '', unique: [] }
  @observable addForm = { ...this.dfAddForm }
  @observable addErrs = { name: '', db: '', service: '' }
  @observable addStatus: IFormStatus = { submit: false, loading: false }
  addInitData = () => {
    this.getDbRows()
    this.getServiceRows()
  }
  @observable
  addFormConf: IAddFormConf = {
    pageTitle: '添加表配置',
    fields: [
      { title: '数据库', field: 'db', type: 'select', data: 'db', span: 12, rules: 'required', },
      { title: '表名', field: 'name', type: 'select', data: 'name', span: 12, rules: 'required', },
      {
        title: '服务', field: 'service', type: 'select', data: 'service', span: 12, rules: 'required',
        props: { mode: 'multiple', valKey: 'name' }
      },
      {
        title: '云文件', field: 'cloudFields', span: 12, type: 'select', data: 'fields',
        props: { mode: 'multiple', valKey: 'name' }
      },
      { title: '唯一键', field: 'unique', data: 'fields', span: 24, render: (item: any) => <RUnique {...item}/> },
      { title: '字段', field: 'fields', span: 24, render: (item: any) => <RFields {...item}/> },
      { title: '关联表', field: 'join', span: 24, data: 'db', render: (item: any) => <RJoin {...item}/> }
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

@observer
class RJoin extends Component<any> {
  state = { tableRows: [], fields: [] }
  add = () => {
    const { value = [], onChange, values, field } = this.props
    value.push({
      db: '',
      table: '',
      onField: '',
      bindField: '',
      type: 'HAS_ONE',
      fields: [],
      whereField: '',
      whereVal: ''
    })
    values[field] = value
    onChange(values)
  }
  cut = (index: number) => {
    const { value = [], onChange, values, field } = this.props
    value.splice(index, 1)
    values[field] = value
    onChange(values)
  }

  dbChange = async (v: string, index: number) => {
    const { value = [], onChange, values, field } = this.props
    value[index].db = v
    value[index].table = ''
    value[index].onField = ''
    value[index].bindField = ''
    value[index].fields = []
    values[field] = value
    onChange(values)
    if (v) {
      const data = await tableRows(v)
      if (data.code === 0) {
        this.setState({ tableRows: data.data })
      }
    }
  }
  tableChange = async (v: string, index: number) => {
    const { value = [], onChange, values, field } = this.props
    value[index].table = v
    value[index].on = []
    value[index].fields = []
    values[field] = value
    onChange(values)
    if (v) {
      const data = await getFields({ db: value[index].db, name: v })
      if (data.code === 0) {
        this.setState({ fields: data.data })
      }
    }
  }
  typeChange = async (v: string, index: number) => {
    const { value = [], onChange, values, field } = this.props
    value[index].type = v
    values[field] = value
    onChange(values)
  }
  fieldsChange = async (v: string, index: number) => {
    const { value = [], onChange, values, field } = this.props
    value[index].fields = v
    values[field] = value
    onChange(values)
  }
  onFieldChange = async (v: string, index: number) => {
    const { value = [], onChange, values, field } = this.props
    value[index].onField = v
    values[field] = value
    onChange(values)
  }
  bindFieldChange = async (v: string, index: number) => {
    const { value = [], onChange, values, field } = this.props
    value[index].bindField = v
    values[field] = value
    onChange(values)
  }
  whereFieldChange = async (v: string, index: number) => {
    const { value = [], onChange, values, field } = this.props
    value[index].whereField = v
    values[field] = value
    onChange(values)
  }
  whereValChange = async (v: string, index: number) => {
    const { value = [], onChange, values, field } = this.props
    value[index].whereVal = v
    values[field] = value
    onChange(values)
  }

  render() {
    const { value = [], data, dict } = this.props
    const { tableRows, fields } = this.state
    return <div>{value.map((item: any, index: number) =>
      <div key={index} style={{ background: '#eee', padding: '10px', marginBottom: '10px' }}>
        <Row>
          <Col span={8}>
            <FormC.Item label="db">
              <Select value={item.db} data={data} onChange={(v) => this.dbChange(v, index)}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="table">
              <Select value={item.table} data={tableRows} onChange={(v) => this.tableChange(v, index)}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="type">
              <Select value={item.type} data={dict.on} onChange={(v) => this.typeChange(v, index)}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="on">
              <Select value={item.onField} data={fields} valKey="name"
                      onChange={(v) => this.onFieldChange(v, index)}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="bind">
              <Select value={item.bindField} data={dict.fields} valKey="name"
                      onChange={(v) => this.bindFieldChange(v, index)}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="fields">
              <Select value={item.fields} mode="multiple" data={fields} valKey="name"
                      onChange={(v) => this.fieldsChange(v, index)}/>
            </FormC.Item>
          </Col>

          <Col span={8}>
            <FormC.Item label="where">
              <Select value={item.whereField} data={fields} valKey="name"
                      onChange={(v) => this.whereFieldChange(v, index)}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="val">
              <Input value={item.whereVal} onChange={(v: any) => this.whereValChange(v, index)}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <Button onClick={() => this.cut(index)}>-</Button>
          </Col>
        </Row>
      </div>
    )}
      <Button onClick={this.add}>+</Button>
    </div>
  }
}

@observer
class RUnique extends Component<any> {
  add = () => {
    const { value = [], onChange, values, field } = this.props
    value.push([])
    values[field] = value
    onChange(values)
  }
  cut = (index: number) => {
    const { value = [], onChange, values, field } = this.props
    value.splice(index, 1)
    values[field] = value
    onChange(values)
  }
  change = (v: any, index: number) => {
    const { value = [], onChange, values, field } = this.props
    value[index] = v
    values[field] = value
    onChange(values)
  }


  render() {
    const { value = [], data } = this.props
    return <div>
      {value.map((item: any, index: number) =>
        <div key={index}>
          <div style={{ display: 'inline-block', marginRight: '10px' }}>
            <Select data={data} value={item} valKey="name" mode="multiple" onChange={(v) => this.change(v, index)}/>
          </div>
          <Button onClick={() => this.cut(index)} style={{ display: 'inline-block' }}>-</Button>
        </div>
      )}
      <Button onClick={this.add}>+</Button>
    </div>
  }
}
