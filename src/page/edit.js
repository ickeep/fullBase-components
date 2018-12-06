import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import { Button, Divider } from 'antd'
import EditForm from '../../components/editForm'
import Content from '../../components/content'
import Breadcrumb from './_unit/breadcrumb'

@withRouter @inject('UI') @observer
export default class  extends Component {
  constructor(props) {
    super(props)
    this.fetchData()
    const { UI, title = '编辑页' } = this.props
    UI.setPageTitle(title)
  }

  async fetchData() {
    const { Store, name = 'edit', location, history } = this.props
    let detailName = name
    const isSetEditDetailForm = !!Store[`${name}DetailForm`]
    if (!isSetEditDetailForm) {
      detailName = name.replace('edit', 'detail')
      detailName = detailName.replace('Edit', 'Detail')
    } else {
      detailName = `${name}Detail`
    }
    Store.urlSetForm({ name: detailName, url: location.search })
    Store.urlSetForm({ name, url: location.search, isVerify: false })
    const initDataFn = Store[`${name}InitData`]
    typeof initDataFn === 'function' && initDataFn.call(Store, { location })
    if (Store[`${detailName}Form`]) {
      const detailData = await Store.getDetail({ formName: detailName })
      if (detailData.code === 1000) {
        const editSetFormBeforeFn = Store[`${name}SetFormBeforeFn`]
        if (typeof editSetFormBeforeFn === 'function') {
          const { data } = await editSetFormBeforeFn.call(Store, { data: detailData, location, history })
          Store.setForm({ name, valObj: data.data })
        } else {
          Store.setForm({ name, valObj: detailData.data })
        }
      }
      const editSetFormAfterFn = Store[`${name}SetFormAfterFn`]
      if (typeof editSetFormAfterFn === "function") {
        editSetFormAfterFn.call(Store, { data: detailData, location, history })
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { location } = this.props
    const newLocation = nextProps.location
    if (newLocation.pathname !== location.pathname || newLocation.search !== location.search) {
      setTimeout(() => this.fetchData())
      const { UI, title = '编辑页' } = this.props
      UI.setPageTitle(title)
    }
  }

  change = (obj) => {
    const { Store, name = 'edit' } = this.props
    Store.setForm({ name, valObj: obj })
  }
  submit = async () => {
    const { Store, name = 'edit', location, history } = this.props
    const editBeforeFn = Store[`${name}BeforeFn`]
    if (typeof editBeforeFn === 'function') {
      if (!editBeforeFn.call(Store, { location, history })) {
        return false
      }
    }
    const editData = await Store.edit({ formName: name })
    Store.msgHandle('编辑成功', editData)
    const editAfterFn = Store[`${name}AfterFn`]
    if (typeof editAfterFn === 'function') {
      if (!editAfterFn.call(Store, { editData, location, history })) {
        return false
      }
    }
    if (editData.code === 1000) {
      const { pathname, search = '' } = location
      const detailUrl = pathname.replace(/\/edit$/, '/detail') + search
      // const editFormConf = Store[`${name}FormConf`]
      // const editForm = Store[`${name}Form`]
      // const { idKey = 'id' } = editFormConf
      // const detailUrl = `${pathname.replace(/\/edit$/, '/detail')}?${idKey}=${editForm[idKey]}${search.replace('?', '&')}`
      const dfEditForm = Store[`df${name.replace(/^\S/, s => s.toUpperCase())}Form`]
      dfEditForm && Store.setForm({ name, valObj: dfEditForm, isVerify: false })
      history.push(detailUrl)
    }
  }

  getEditPageOperations = (editPageOperations) => {
    if (!editPageOperations) return null;
    const {Store} = this.props;
    let isArray = Object.prototype.toString.call(editPageOperations).includes('Array');
    let maps = isArray ? Array.from(editPageOperations) : [editPageOperations];
    return maps.map((item, key) => {
      const {ModalUI, modalProps = {}} = item;
      return ModalUI && <ModalUI {...modalProps} Store={Store} key={key}/>
    });
  }

  render() {
    const { Store, name = 'edit', title = '编辑', history } = this.props
    const { dict } = Store
    const editFormConf = Store[`${name}FormConf`]
    if (!editFormConf) {
      return (<Content errObj={{ code: 403003, message: `Store 的 ${name}FormConf 未定义` }}/>)
    }
    const editForm = Store[`${name}Form`]
    if (!editForm) {
      return (<Content errObj={{ code: 403003, message: `Store 的 ${name}Form 未定义` }}/>)
    }
    const editErrs = Store[`${name}Errs`]
    const editStatus = Store[`${name}Status`]
    if (!editStatus) {
      return (<Content errObj={{ code: 403003, message: `Store 的 ${name}Status 未定义` }}/>)
    }
    const breadcrumb = Store[`${name}Breadcrumb`]
    const editPageFormAfterNode = Store[`${name}PageFormAfterNode`] || ''
    const editPageFormBeforeNode = Store[`${name}PageFormAfterNode`] || ''
    const editPageOperations = Store[`${name}PageOperations`] || ''
    const { loading, submit } = editStatus
    const { type = 'grid', fields = [], blocks = [] } = editFormConf
    return (
      <div className="content c-p-edit">
        <div className="m-add-title">
          <Breadcrumb data={breadcrumb} dfTitle={title && title.split('-') && title.split('-')[0]}/>
        </div>
        <Divider/>
        {editPageFormBeforeNode}
        {type === 'grid' &&
        <EditForm
          data={dict}
          conf={{ layout: 'inline', ...editFormConf.props }}
          fields={fields}
          values={editForm}
          errs={editErrs}
          onChange={this.change}
          onSubmit={this.submit}
          loading={loading}
        >
          {editPageFormAfterNode}
          <Divider/>
          <Button htmlType="submit" type="primary" className="btn-save" loading={loading} disabled={!submit}>保存</Button>
          <Button onClick={history.goBack}>返回</Button>
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
                  conf={{ layout: 'inline', ...item.props }}
                  fields={item.fields || []}
                  values={editForm}
                  errs={editErrs}
                  onChange={this.change}
                  onSubmit={this.submit}
                  loading={loading}
                />
              </div>
            </div>)}
          {editPageFormAfterNode}
          <Divider/>
          <Button htmlType="submit" type="primary" className="btn-save" loading={loading} disabled={!submit}>保存</Button>
          <Button onClick={history.goBack}>返回</Button>
        </div>}
        {this.getEditPageOperations(editPageOperations)}
      </div>
    )
  }
}
