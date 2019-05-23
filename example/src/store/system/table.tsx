import { Curd, Form } from 'fullbase-components'
import IStore from 'fullbase-components/dist/store/_i'
import { observable, action, computed } from 'mobx'
import { list } from '../../api/system/table'
import Http from '../../api/http'

const { dfDataPage } = Http
@Curd @Form
export default class Table implements IStore {
  dataFn = { list }
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
  // isEnable = (r: { status: string }): boolean => {
  //   return r && parseInt(r.status, 10) === 1
  // }

  // @observable listOperateStatus: IListOperateStatus = {}
  // @action
  // enableItem = async ({ record }: IListOperateActionOpt) => {
  //   const enableData = await this.dataFn.enable({ id: record.id })
  //   enableData[errno] === successErrno ? record.status = 1 : ''
  // }
  // @action
  // disableItem = async ({ record }: IListOperateActionOpt) => {
  //   const disableData = await this.dataFn.disable({ id: record.id })
  //   disableData[errno] === successErrno ? record.status = 0 : ''
  // }
  // @action
  // delItem = async ({ record, index }: IListOperateActionOpt) => {
  //   const delData = await this.dataFn.del({ id: record.id })
  //   delData[errno] === successErrno && this.listData.data.data.splice(index, 1)
  // }
  // listOperateConf: IListOperateConf = {
  //   props: { width: 280 },
  //   items: [
  //     {
  //       actionName: '启用', whom: 'name',
  //       action: this.enableItem,
  //       show: (r: any) => !this.isEnable(r),
  //       props: { type: 'primary' },
  //     },
  //     {
  //       actionName: '停用', whom: 'name', isConfirm: true,
  //       action: this.disableItem,
  //       show: (r: any) => this.isEnable(r),
  //       props: { type: 'danger' },
  //     },
  //     {
  //       actionName: '修改', whom: 'name',
  //       urlFn: (r: any) => `/rbac/user/edit?id=${r.id}`,
  //     },
  //     {
  //       actionName: '删除', whom: 'name', isConfirm: true,
  //       action: this.delItem,
  //       props: { type: 'danger' },
  //     },
  //   ]
  // }
}
