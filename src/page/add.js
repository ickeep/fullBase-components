import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {withRouter} from 'react-router-dom'
import {Button, Divider} from 'antd'
import EditForm from '../../components/editForm'
import Content from '../../components/content'
import Breadcrumb from './_unit/breadcrumb'
import PageTips from "./_unit/pageTips";
import ActionBtn from "./_unit/actionsBtn";

@withRouter @inject('UI') @observer
export default class  extends Component {
  constructor(props) {
    super(props)
    this.fetchData()
    const {UI, title = '添加页'} = this.props
    UI.setPageTitle(title)
  }

  async fetchData() {
    const {Store, name = 'add', location} = this.props
    const initDataFn = Store[`${name}InitData`]
    typeof initDataFn === 'function' && initDataFn.call(Store, {location})
    location.search && Store.urlSetForm({name, url: location.search, isVerify: false})
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {location} = this.props
    const newLocation = nextProps.location
    if (newLocation.pathname !== location.pathname || newLocation.search !== location.search) {
      setTimeout(() => this.fetchData())
      const {UI, title = '添加页'} = this.props
      UI.setPageTitle(title)
    }
  }
  componentWillUnmount () {
    const { Store, name = 'detail', location } = this.props;
    const LeaveDataFn = Store[`${name}LeaveData`];
    typeof LeaveDataFn === 'function' && LeaveDataFn.call(Store, { location });
  }
  change = (obj) => {
    const {Store, name = 'add'} = this.props
    Store.setForm({name, valObj: obj})
  }
  submit = async () => {
    const { Store, name = 'add', location, history } = this.props
    const addBeforeFn = Store[`${name}BeforeFn`]
    if (typeof addBeforeFn === 'function') {
      if (!addBeforeFn.call(Store, { location, history })) {
        return false
      }
    }
    const addData = await Store.add({ formName: name })
    Store.msgHandle('添加成功', addData)
    const addAfterFn = Store[`${name}AfterFn`]
    if (typeof addAfterFn === 'function') {
      if (!addAfterFn.call(Store, {addData, location, history})) {
        return false
      }
    }
    if (addData.code === 1000) {
      const addFormConf = Store[`${name}FormConf`]
      const addForm = Store[`${name}Form`]
      const {idKey = 'id'} = addFormConf
      const {pathname, search = ''} = location
      const detailUrl = `${pathname.replace(/\/add$/, '/detail')}?${idKey}=${addForm[idKey] || addData.data[idKey]}${search.replace('?', '&')}`
      const dfAddForm = Store[`df${name.replace(/^\S/, s => s.toUpperCase())}Form`]
      dfAddForm && Store.setForm({name, valObj: dfAddForm})
      history.push(detailUrl)
    }
  }

  getAddPageOperations = (addPageOperations) => {
    if (!addPageOperations) return null;
    const {Store} = this.props;
    let isArray = Object.prototype.toString.call(addPageOperations).includes('Array');
    let maps = isArray ? Array.from(addPageOperations) : [addPageOperations];
    return maps.map((item, key) => {
      const {ModalUI, modalProps = {}} = item;
      return ModalUI && <ModalUI {...modalProps} Store={Store} key={key}/>
    });
  }

  render() {
    const {Store, name = 'add', title = '添加'} = this.props
    const {dict = {}} = Store
    const addFormConf = Store[`${name}FormConf`]
    if (!addFormConf) {
      return (<Content errObj={{code: 403003, message: `Store 的 ${name}FormConf 未定义`}}/>)
    }
    const addForm = Store[`${name}Form`]
    if (!addForm) {
      return (<Content errObj={{code: 403003, message: `Store 的 ${name}Form 未定义`}}/>)
    }
    const addErrs = Store[`${name}Errs`]
    const addStatus = Store[`${name}Status`]
    if (!addStatus) {
      return (<Content errObj={{code: 403003, message: `Store 的 ${name}Status 未定义`}}/>)
    }
    const breadcrumb = Store[`${name}Breadcrumb`]
    const addPageFormAfterNode = Store[`${name}PageFormAfterNode`] || ''
    const addPageFormBeforeNode = Store[`${name}PageFormBeforeNode`] || ''
    const addPageOperations = Store[`${name}PageOperations`] || ''
    const { loading, submit } = addStatus
    const { type = 'grid', fields = [], blocks = [] } = addFormConf
    const addTips = Store[`${name}Tips`]
    const btnConf = Object.assign({ifAdd: true, ifBack: true, ifEdit: false}, Store[`${name}BtnConf`] || {})
    const addActions = Store[`${name}Actions`]
    const {ifAdd = true} = btnConf
    return (
      <div className="content c-p-add">
        <div className="m-add-title">
          <Breadcrumb data={breadcrumb} dfTitle={title && title.split('-') && title.split('-')[0]}/>
        </div>
        <Divider/>
        {addTips && <PageTips {...addTips}/>}
        {addPageFormBeforeNode}
        {type === 'grid' &&
        <EditForm
          data={dict}
          conf={{layout: 'inline', ...addFormConf.props}}
          fields={fields}
          values={addForm}
          errs={addErrs}
          onChange={this.change}
          onSubmit={this.submit}
          loading={loading}
        >
          {addPageFormAfterNode}
          <Divider/>
          <div style={{position:'relative'}}>
            {ifAdd &&
            <Button htmlType="submit" type="primary" className="btn-add" loading={loading} disabled={!submit}>添加</Button>}
            <div style={{position:'absolute', left: ifAdd ? '80px': 0, top: 0, right: 0}}>
              <ActionBtn btnConf={btnConf} actions={addActions} />
            </div>
          </div>
        </EditForm>
        }
        {type === 'blocks' &&
        <div className="m-blocks-wp">
          {blocks.map && blocks.map((item, index) =>
            <div className="m-blocks-form" key={index} style={item.style || {}}>
              {item.title && <h3 className="title">{item.title}</h3>}
              <div className="u-block-form">
                <EditForm
                  data={dict}
                  conf={{layout: 'inline', ...item.props}}
                  fields={item.fields || []}
                  values={addForm}
                  errs={addErrs}
                  onChange={this.change}
                  onSubmit={this.submit}
                  loading={loading}
                />
              </div>
            </div>)}
          {addPageFormAfterNode}
          <Divider/>
          <div style={{position:'relative'}}>
            {ifAdd &&
            <Button htmlType="submit" type="primary" className="btn-add" loading={loading} disabled={!submit}>添加</Button>}
            <div style={{position:'absolute', left: ifAdd ? '80px': 0, top: 0, right: 0}}>
              <ActionBtn btnConf={btnConf} actions={addActions} />
            </div>
          </div>
        </div>}
        {this.getAddPageOperations(addPageOperations)}
      </div>
    )
  }
}
