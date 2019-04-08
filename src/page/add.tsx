import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Divider } from 'antd'
import EditForm from '../form/editForm'
import Content from '../display/content'
import Breadcrumb from './_unit/breadcrumb'
import PageTips from "./_unit/pageTips";
import ActionBtn from "./_unit/actionsBtn";
import { IUI } from "../../store/ui";
import './add.less'
import UI from "../../store/ui";

interface IProps extends RouteComponentProps {
  UI?: IUI,
  Store: any,
  name?: string,
  itemMap?: any
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
  class Add extends Component<IProps> {
    setTitle() {
      const { UI, Store, name = 'add' } = this.props
      const addFormConf = Store[`${name}FormConf`] || {}
      UI && UI.setPageTitle(addFormConf.pageTitle || '添加页')
    }

    constructor(props: IProps) {
      super(props)
      this.fetchData()
      this.setTitle()
    }

    async fetchData() {
      const { Store, name = 'add', location } = this.props
      const initDataFn = Store[`${name}InitData`]
      typeof initDataFn === 'function' && initDataFn.call(Store, { location })
      location.search && Store.urlSetForm({ name, url: location.search, isVerify: false })
    }

    UNSAFE_componentWillReceiveProps(nextProps: IProps) {
      const { location } = this.props
      const newLocation = nextProps.location
      if (newLocation.pathname !== location.pathname || newLocation.search !== location.search) {
        setTimeout(() => this.fetchData())
        this.setTitle()
      }
    }

    componentWillUnmount() {
      const { Store, name = 'detail', location } = this.props;
      const LeaveDataFn = Store[`${name}LeaveData`];
      typeof LeaveDataFn === 'function' && LeaveDataFn.call(Store, { location });
    }

    change = (obj: object) => {
      const { Store, name = 'add' } = this.props
      Store.setForm({ name, valObj: obj })
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
      if (addData.code === dfValidatedErrno) {
        Store.setErrs({ name, data: addData.data })
      }
      const addAfterFn = Store[`${name}AfterFn`]
      if (typeof addAfterFn === 'function') {
        if (!addAfterFn.call(Store, { addData, location, history })) {
          return false
        }
      }
      if (addData[dfFormat.errno] === successErrno) {
        const addFormConf = Store[`${name}FormConf`]
        const addForm = Store[`${name}Form`]
        const { idKey = 'id' } = addFormConf
        const { pathname, search = '' } = location
        const data = addData[dfFormat.data]
        const dfAddForm = Store[`df${name.replace(/^\S/, s => s.toUpperCase())}Form`]
        dfAddForm && Store.setForm({ name, valObj: dfAddForm })
        if (!(addForm[idKey] || (data && data[idKey]))) {
          history.goBack()
        } else {
          const detailPathname = pathname.replace(/\/add$/, '/detail')
          const detailSearch = `?${idKey}=${addForm[idKey] || data[idKey]}${search.replace('?', '&')}`
          history.replace(detailPathname + detailSearch)
        }
      }
    }

    getAddPageOperations = (addPageOperations: any) => {
      if (!addPageOperations) return null;
      const { Store } = this.props;
      let isArray = Object.prototype.toString.call(addPageOperations).includes('Array');
      let maps = isArray ? Array.from(addPageOperations) : [addPageOperations];
      return maps.map((item, key) => {
        const { ModalUI, modalProps = {} } = item;
        return ModalUI && <ModalUI {...modalProps} Store={Store} key={key}/>
      });
    }

    render() {
      const { Store, name = 'add', UI: { layout: { clientWidth } } = UI, itemMap = dfIemMap } = this.props
      const { dict = {} } = Store
      const addFormConf = Store[`${name}FormConf`]
      if (!addFormConf) {
        return (<Content code={403003} msg={`Store 的 ${name}FormConf 未定义`}/>)
      }
      const addForm = Store[`${name}Form`]
      if (!addForm) {
        return (<Content code={403003} msg={`Store 的 ${name}Form 未定义`}/>)
      }
      const addErrs = Store[`${name}Errs`]
      const addStatus = Store[`${name}Status`]
      if (!addStatus) {
        return (<Content code={403003} msg={`Store 的 ${name}Status 未定义`}/>)
      }
      const title = addFormConf.pageTitle || '添加页'
      const breadcrumb = Store[`${name}Breadcrumb`]
      const addPageFormAfterNode = Store[`${name}PageFormAfterNode`] || ''
      const addPageFormBeforeNode = Store[`${name}PageFormBeforeNode`] || ''
      const addPageOperations = Store[`${name}PageOperations`] || ''
      const { loading, submit } = addStatus
      const { type = 'grid', fields = [], blocks = [] } = addFormConf
      const addTips = Store[`${name}Tips`]
      const btnConf = Object.assign({ isAdd: true, isBack: true, isEdit: false }, Store[`${name}BtnConf`] || {})
      const isMobile = clientWidth < dfMobileWidth
      const { isAdd = true, isBack = true, actions: BtnActions = [], addBtnName = '添加' } = btnConf
      if (isAdd) {
        BtnActions.push({
          onClick: this.submit,
          htmlType: "button",
          type: "primary",
          loading,
          disabled: !submit,
          children: addBtnName
        })
      }
      return (
        <div className="content m-add">
          <div className="m-add-title">
            <Breadcrumb data={breadcrumb} dfTitle={title && title.split('-') && title.split('-')[0]}/>
          </div>
          <Divider/>
          {addTips && <PageTips {...addTips}/>}
          {addPageFormBeforeNode}
          {type === 'grid' &&
          <EditForm
            conf={{ layout: isMobile ? 'vertical' : 'inline', ...addFormConf.props }}
            loading={loading}
            itemMap={itemMap}
            Store={Store} name={name}
            onSubmit={this.submit}
          />}
          {addPageFormAfterNode}
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
            {addPageFormAfterNode}
          </div>
          }
          <ActionBtn actions={BtnActions} isBack={isBack}/>
          {this.getAddPageOperations(addPageOperations)}
        </div>
      )
    }
  }

  return withRouter(Add)
}
