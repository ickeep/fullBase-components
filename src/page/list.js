/* eslint-disable no-script-url */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import { Divider, Button, Tabs, Row, Col } from 'antd'
import ContentFn from '../layout/content'
import EditForm from '../form/editForm'
import ListTable from './_unit/listTable'
import Link from '../display/link'
import PageTips from './_unit/pageTips'
import Breadcrumb from './_unit/breadcrumb'
import '../../assets/less/list.less'

export default function ({
                           successVal = 0,
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
                           authVal = 401100,
                           itemMap
                         } = {}) {
  const dfSuccessVal = successVal
  const dfAuthVal = authVal
  const dfFormat = format
  const dfIemMap = itemMap
  const Content = ContentFn({ successVal, format, authVal })

  @withRouter @inject('UI', 'Auth') @observer
  class List extends Component {
    constructor(props) {
      super(props)
      this.fetchData()
      const { UI, title = '列表页' } = this.props
      UI.setPageTitle(title)
    }

    async fetchData() {
      const { Store, location, name = 'list', Auth } = this.props
      Store.urlSetForm({ name, url: location.search })
      const initDataFn = Store[`${name}InitData`]
      typeof initDataFn === 'function' && initDataFn.call(Store, { location, Auth })
      Store.getList({ formName: name })
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      const { location } = this.props
      const newLocation = nextProps.location
      if (newLocation.pathname !== location.pathname || newLocation.search !== location.search) {
        setTimeout(() => this.fetchData())
        const { UI, title = '列表页' } = this.props
        UI.setPageTitle(title)
      }
    }

    formChange = (obj) => {
      const { Store, name = 'list' } = this.props
      Store.setForm({ name, valObj: obj })
    }
    routePush = (queryStr) => {
      if (queryStr !== this.props.location.search) {
        const path = this.props.location.pathname
        this.props.history.push(path + queryStr)
      } else {
        this.fetchData()
      }
    }
    submit = () => {
      const { Store, name = 'list' } = this.props
      const queryStr = `?${Store.getUrlParamsStr({ formName: name })}`
      this.routePush(queryStr)
    }
    exportList = () => {
      const { Store, name = 'list' } = this.props
      Store.exportList({ formName: name })
    }
    pageSizeChange = (cur, size) => {
      const { Store, name = 'list', location } = this.props
      Store.urlSetForm({ name, url: location.search })
      const valObj = {}
      valObj[dfFormat.page] = cur
      valObj[dfFormat.currentPage] = cur
      valObj[dfFormat.pageSize] = size
      Store.setForm({ name, valObj })
      const queryStr = `?${Store.getUrlParamsStr({ formName: name, page: true, sorter: true })}`
      this.routePush(queryStr)
    }
    pageChange = (page) => {
      const { Store, name = 'list', location } = this.props
      Store.urlSetForm({ name, url: location.search })
      const valObj = {}
      valObj[dfFormat.page] = page
      valObj[dfFormat.currentPage] = page
      Store.setForm({ name, valObj })
      const queryStr = `?${Store.getUrlParamsStr({ formName: name, page: true, sorter: true })}`
      this.routePush(queryStr)
    }
    sorter = ({ field, order }) => {
      const { Store, name = 'list', location } = this.props
      Store.urlSetForm({ name, url: location.search })
      Store.setForm({ name, valObj: { _sorterField: field, _sorterVal: order } })
      const queryStr = `?${Store.getUrlParamsStr({ formName: name, page: false, sorter: true })}`
      this.routePush(queryStr)
    }

    tagChange = (val) => {
      const { Store, name = 'list', } = this.props
      const listFormConf = Store[`${name}FormConf`] || {}
      const tagChange = Store[`${name}TagChange`] || false;
      const { tabField } = listFormConf
      tagChange && tagChange(val)
      this.routePush(`?${tabField}=${val}`)
    }
    getListAddConfInner = (conf) => {
      if (!conf) return null;
      let isArray = Object.prototype.toString.call(conf).includes('Array');
      let maps = isArray ? Array.from(conf) : [conf];
      return <div className="link"><Row> {
        maps.map(listAddConf => {
          return listAddConf.name && <Col key={listAddConf.name} span={24 / maps.length}>
            <Link className=""
                  href={listAddConf.url ? (typeof listAddConf.url === 'function' ? listAddConf.url() : listAddConf.url) : 'javascript:;'}>
              <Button type="primary" {...listAddConf.props}>{listAddConf.name}</Button></Link></Col>
        })
      }
      </Row>
      </div>
    };
    getListBatchOperationsRender = (listBatchOperations) => {
      if (!listBatchOperations) return null;
      const { Store } = this.props;
      let isArray = Object.prototype.toString.call(listBatchOperations).includes('Array');
      let maps = isArray ? Array.from(listBatchOperations) : [listBatchOperations];
      return maps.map((item, key) => {
        const { ModalUI, modalProps = {} } = item;
        return ModalUI && <ModalUI {...modalProps} Store={Store} key={key}/>
      });
    };

    componentDidUpdate() {
      const { Store, name = 'list', } = this.props;
      const listDidUpdate = Store[`${name}DidUpdate`];
      listDidUpdate instanceof Function && listDidUpdate.call(Store);
    }

    render() {
      const { Store, name = 'list', Auth, title = '列表页', itemMap = dfIemMap } = this.props
      const listAddConf = Store[`${name}AddConf`] || []
      const { Table = ListTable } = Store
      const listFormConf = Store[`${name}FormConf`] || {}
      const dict = Store.dict || {}
      const listOperate = Store[`${name}Operate`] || {}
      const loading = Store[`${name}Loading`]
      const exportLoading = Store[`${name}ExportLoading`]
      const listForm = Store[`${name}Form`] || {}
      const listData = Store[`${name}Data`] || Object.assign({}, Store.dfDataPage)
      const tableFn = Store[`${name}TableFn`]
      const listTableActions = Store[`${name}TableActions`]
      const listBatchOperations = Store[`${name}BatchOperations`] || []
      const listTips = Store[`${name}Tips`]
      const breadcrumb = Store[`${name}Breadcrumb`]
      const tableProps = typeof tableFn === 'function' ? tableFn.call(Store, { user: Auth.user }) : Store[`${name}Table`] || {}
      const { ifExport = false, ifSearch = true, tabs, fields = [], tabField } = listFormConf
      const listPageFormBeforeNode = Store[`${name}PageFormBeforeNode`] || null
      const listPageFormAfterNode = Store[`${name}PageFormAfterNode`] || null
      const listPageTableBeforeNode = Store[`${name}PageTableBeforeNode`] || null
      const listPageTableAfterNode = Store[`${name}PageTableAfterNode`] || null
      const pagination = {
        current: listData.data[dfFormat.currentPage] || 0,
        total: listData.data[dfFormat.count] || 0,
        pageSize: listData.data[dfFormat.pageSize] || 0,
        showSizeChanger: true,
        size: 'small'
      }
      const errObj = {}
      errObj[dfFormat.errno] = listData[dfFormat.errno]
      errObj[dfFormat.errmsg] = listData[dfFormat.errmsg]
      const editFormProps = { data: dict, conf: { layout: 'inline' }, fields, values: listForm, loading }
      if (itemMap) {
        editFormProps.itemMap = itemMap
      }
      return (
        <div className="m-list">
          <div className="m-list-title">
            <Breadcrumb data={breadcrumb} dfTitle={title && title.split('-') && title.split('-')[0]}/>
            {this.getListAddConfInner(listAddConf)}
          </div>
          <Divider/>
          {listTips && <PageTips {...listTips}/>}
          {listPageFormBeforeNode}
          {tabs && tabs.map &&
          <Tabs activeKey={listForm[tabField] + ''} onChange={this.tagChange}>
            {tabs.map((item) => <Tabs.TabPane tab={item.name} key={item.value + ''}/>)}
          </Tabs>
          }
          <EditForm {...editFormProps} onChange={this.formChange} onSubmit={this.submit}>
            {ifSearch &&
            <Button htmlType="submit" type="primary" icon={loading ? '' : 'search'} loading={loading}>查询</Button>}
            {ifExport &&
            <Button htmlType="button" loading={exportLoading} type="primary" ghost
                    icon={exportLoading ? '' : 'download'}
                    style={{ marginLeft: '10px' }}
                    onClick={this.exportList}>
              导出
            </Button>
            }
          </EditForm>
          {listPageFormAfterNode}
          {(ifSearch || ifExport) && <Divider/>}
          {listPageTableBeforeNode}
          {errObj[dfFormat.errno] === '' || errObj[dfFormat.errno] !== dfSuccessVal ?
            <Content errObj={errObj} loading={loading}/>
            :
            <Table
              loading={loading}
              operate={listOperate}
              data={listData.data}
              onPageSizeChange={this.pageSizeChange}
              onPageChange={this.pageChange}
              onSorter={this.sorter}
              listTableActions={listTableActions}
              pagination={pagination}
              {...tableProps}
            />
          }
          {listPageTableAfterNode}
          {this.getListBatchOperationsRender(listBatchOperations)}
        </div>
      )
    }
  }

  return List
}
