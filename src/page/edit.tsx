import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Divider, Spin } from 'antd'
import EditForm from '../form/editForm'
import Content from '../display/content'
import ActionBtn from "./_unit/actionsBtn";
import Breadcrumb from './_unit/breadcrumb'
import UI, { IUI } from "../../store/ui";
import '../../example/src/less/page/edit.less'

interface IProps extends RouteComponentProps {
  Store: any,
  name?: string,
  UI?: IUI
}

export default function ({
                           successErrno = 0,
                           validatedErrno = 403001,
                           mobileWidth = 768,
                           format = {
                             errno: 'errno',
                             errmsg: 'errmsg',
                             data: 'data',
                             page: 'page',
                             pageSize: 'pageSize',
                             currentPage: 'currentPage',
                             count: 'count',
                             totalPages: 'totalPages'
                           },
                           authErrno = 401100,
                           itemMap
                         }: { [key: string]: any } = {}) {
  const dfSuccessErrno = successErrno
  const dfValidatedErrno = validatedErrno
  const dfAuthErrno = authErrno
  const dfMobileWidth = mobileWidth
  const dfFormat = format
  const dfIemMap = itemMap

  @inject('UI') @observer
  class Edit extends Component<IProps> {
    setTitle() {
      const { UI, Store, name = 'edit' } = this.props
      const editFormConf = Store[`${name}FormConf`] || {}
      UI && UI.setPageTitle(editFormConf.pageTitle || '编辑页')
    }

    constructor(props: IProps) {
      super(props)
      this.fetchData()
      this.setTitle()
    }

    getDetailName = () => {
      const { Store, name = 'edit' } = this.props
      let detailName = name
      const isSetEditDetailForm = !!Store[`${name}DetailForm`]
      if (!isSetEditDetailForm) {
        detailName = name.replace('edit', 'detail')
        detailName = detailName.replace('Edit', 'Detail')
      } else {
        detailName = `${name}Detail`
      }
      return detailName
    }

    async fetchData() {
      const { Store, name = 'edit', location, history } = this.props
      const detailName = this.getDetailName()
      Store.urlSetForm({ name: detailName, url: location.search })
      Store.urlSetForm({ name, url: location.search, isVerify: false })
      const initDataFn = Store[`${name}InitData`]
      typeof initDataFn === 'function' && initDataFn.call(Store, { location })
      if (Store[`${detailName}Form`]) {
        const detailData = await Store.getDetail({ formName: detailName })
        if (detailData[dfFormat.errno] === dfSuccessErrno) {
          const editSetFormBeforeFn = Store[`${name}SetFormBeforeFn`]
          if (typeof editSetFormBeforeFn === 'function') {
            const { data } = await editSetFormBeforeFn.call(Store, { data: detailData, location, history })
            Store.setForm({ name, valObj: data[dfFormat.data] })
          } else {
            Store.setForm({ name, valObj: detailData[dfFormat.data] })
          }
        }
        const editSetFormAfterFn = Store[`${name}SetFormAfterFn`]
        if (typeof editSetFormAfterFn === "function") {
          editSetFormAfterFn.call(Store, { data: detailData, location, history })
        }
      }
    }

    UNSAFE_componentWillReceiveProps(nextProps: IProps) {
      const { location } = this.props
      const newLocation = nextProps.location
      if (newLocation.pathname !== location.pathname || newLocation.search !== location.search) {
        setTimeout(() => this.fetchData())
        this.setTitle()
      }
    }

    change = (obj: object) => {
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
      const errno = editData[dfFormat.errno]

      if (errno === dfValidatedErrno) {
        Store.setErrs({ name, data: editData[dfFormat.data] })
      }

      const editAfterFn = Store[`${name}AfterFn`]
      if (typeof editAfterFn === 'function') {
        if (!editAfterFn.call(Store, { editData, location, history })) {
          return false
        }
      }
      if (errno === successErrno) {
        const { pathname, search = '' } = location
        const detailUrl = pathname.replace(/\/edit$/, '/detail') + search
        // const editFormConf = Store[`${name}FormConf`]
        // const editForm = Store[`${name}Form`]
        // const { idKey = 'id' } = editFormConf
        // const detailUrl = `${pathname.replace(/\/edit$/, '/detail')}?${idKey}=${editForm[idKey]}${search.replace('?', '&')}`
        const dfEditForm = Store[`df${name.replace(/^\S/, s => s.toUpperCase())}Form`]
        dfEditForm && Store.setForm({ name, valObj: dfEditForm, isVerify: false })
        history.replace(detailUrl)
      }
    }

    getEditPageOperations = (editPageOperations: any) => {
      if (!editPageOperations) return null;
      const { Store } = this.props;
      let isArray = Object.prototype.toString.call(editPageOperations).includes('Array');
      let maps = isArray ? Array.from(editPageOperations) : [editPageOperations];
      return maps.map((item, key) => {
        const { ModalUI, modalProps = {} } = item;
        return ModalUI && <ModalUI {...modalProps} Store={Store} key={key}/>
      });
    }

    render() {
      const { Store, name = 'edit', history, UI: { layout: { clientWidth } } = UI, } = this.props
      const { dict } = Store
      const editFormConf = Store[`${name}FormConf`]
      if (!editFormConf) {
        return (<Content code={403003} msg={`Store 的 ${name}FormConf 未定义`}/>)
      }
      const editForm = Store[`${name}Form`]
      if (!editForm) {
        return (<Content code={403003} msg={`Store 的 ${name}Form 未定义`}/>)
      }
      const editErrs = Store[`${name}Errs`]
      const editStatus = Store[`${name}Status`]
      if (!editStatus) {
        return (<Content code={403003} msg={`Store 的 ${name}Status 未定义`}/>)
      }
      const breadcrumb = Store[`${name}Breadcrumb`]
      const editPageFormAfterNode = Store[`${name}PageFormAfterNode`] || ''
      const editPageFormBeforeNode = Store[`${name}PageFormAfterNode`] || ''
      const editPageOperations = Store[`${name}PageOperations`] || ''
      const { loading, submit } = editStatus
      const { type = 'grid', fields = [], blocks = [] } = editFormConf
      const title = editFormConf.pageTitle || '编辑页'
      const detailName = this.getDetailName()
      const detailData = Store[`${detailName}Data`]
      const detailLoading = Store[`${detailName}Loading`] || false
      const detailErrno = detailData[dfFormat.errno]
      const detailErrmsg = detailData[dfFormat.errmsg]
      const isMobile = clientWidth < dfMobileWidth

      const btnConf = Object.assign({ isSave: true, isBack: true }, Store[`${name}BtnConf`] || {})
      const { isSave = true, isBack = true, actions: BtnActions = [], saveBtnName = '保存' } = btnConf
      if (isSave) {
        BtnActions.push({
          onClick: this.submit,
          htmlType: "button",
          type: "primary",
          loading,
          disabled: !submit,
          children: saveBtnName
        })
      }

      return (
        <div className="content m-edit">
          <div className="m-add-title">
            <Breadcrumb data={breadcrumb} dfTitle={title && title.split('-') && title.split('-')[0]}/>
          </div>
          <Divider/>
          {editPageFormBeforeNode}
          {detailLoading !== true && detailErrno !== '' && detailErrno !== dfSuccessErrno ?
            <Content code={detailErrno} msg={detailErrmsg}/> :
            <Spin spinning={detailLoading} delay={400} tip="loading……">
              {type === 'grid' &&
              <EditForm
                conf={{ layout: isMobile ? 'vertical' : 'inline', ...editFormConf.props }}
                loading={loading}
                itemMap={itemMap}
                Store={Store} name={name}
                onSubmit={this.submit}
              />}
              {type === 'blocks' &&
              <div className="m-blocks-wp">
                {blocks.map && blocks.map((item: any, index: number) =>
                  <div className="m-blocks-form" key={index} style={item.style || {}}>
                    {item.title && <h3 className="title">{item.title}</h3>}
                    <div className="u-block-form">
                      <EditForm
                        conf={{ layout: isMobile ? 'vertical' : 'inline', ...item.props }}
                        fields={item.fields || []}
                        itemMap={itemMap}
                        Store={Store} name={name}
                        onSubmit={this.submit}
                      />
                    </div>
                  </div>)}
              </div>}
              {editPageFormAfterNode}
              <ActionBtn actions={BtnActions} isBack={isBack}/>
            </Spin>
          }
          {this.getEditPageOperations(editPageOperations)}
        </div>
      )
    }
  }

  return withRouter(Edit)
}
