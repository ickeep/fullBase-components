import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import Content from '../content'
import { Divider } from 'antd'
import DetailGrid from './_unit/detailGrid'
import ActionBtn from './_unit/actionsBtn'
import PageTips from './_unit/pageTips'
import Breadcrumb from './_unit/breadcrumb'

@withRouter @inject('UI', 'Auth') @observer
export default class  extends Component {
  constructor(props) {
    super(props)
    this.fetchData()
    const { UI, title = '详情页' } = props
    UI.setPageTitle(title)
  }

  async fetchData() {
    const { Store, name = 'detail', location, Auth } = this.props
    const initDataFn = Store[`${name}InitData`]
    typeof initDataFn === 'function' && initDataFn.call(Store, { location, Auth })
    location.search && Store.urlSetForm({ name, url: location.search })
    Store.getDetail({ formName: name })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { location } = this.props
    const newLocation = nextProps.location
    if (newLocation.pathname !== location.pathname || newLocation.search !== location.search) {
      setTimeout(() => this.fetchData())
      const { UI, title = '详情页' } = this.props
      UI.setPageTitle(title)
    }
  }
  componentWillUnmount () {
    const { Store, name = 'detail', location } = this.props;
    const LeaveDataFn = Store[`${name}LeaveData`];
    typeof LeaveDataFn === 'function' && LeaveDataFn.call(Store, { location });
  }
  render() {
    const { Store, name = 'detail', title = '详情', history, location, PageUI, UI, Auth } = this.props
    const detailData = Store[`${name}Data`]
    if (!detailData) {
      return (<Content errObj={{ code: 403003, message: `Store 的 ${name}Data 未定义` }}/>)
    }
    const loading = Store[`${name}Loading`]
    if (typeof loading === 'undefined') {
      return (<Content errObj={{ code: 403003, message: `Store 的 ${name}Loading 未定义` }}/>)
    }
    const breadcrumb = Store[`${name}Breadcrumb`]
    const detailShowConfFn = Store[`${name}ShowConfFn`]
    const detailTips = Store[`${name}Tips`]
    const detailActions = Store[`${name}Actions`]
    const detailOperate = Store[`${name}Operate`] || {}
    const DetailOperateUI = detailOperate.UI

    const detailShowConf = typeof detailShowConfFn === 'function' ? detailShowConfFn.call(Store, {
      UI,
      Auth,
      history,
      location,
    }) : Store[`${name}ShowConf`] || {}

    const errObj = { code: detailData.code, message: detailData.message || detailData.msg }
    const { data = {} } = detailData
    const btnConf = Store[`${name}BtnConf`] || {}
    return (
      <Content errObj={errObj} loading={loading}>
        <div className="content c-p-detail">
          <div className="m-add-title">
            <Breadcrumb data={breadcrumb} dfTitle={title && title.split('-') && title.split('-')[0]}/>
          </div>
          <Divider/>
          {detailTips && <PageTips {...detailTips}/>}
          {errObj.code === 1000 &&
          <DetailContent Store={Store} data={data} PageUI={PageUI} detailShowConf={detailShowConf}/>
          }
          {errObj.code !== 1000 &&
          <div>{errObj.message}</div>
          }
          <Divider/>
          <ActionBtn btnConf={btnConf} actions={detailActions}/>
        </div>
        {DetailOperateUI && <DetailOperateUI {...detailOperate.props} Store={Store}/>}
      </Content>
    )
  }
}

@observer
class DetailContent extends Component {
  render() {
    const { Store, PageUI, detailShowConf, data } = this.props
    const { type = 'grid', blocks = [], fields } = detailShowConf
    if (PageUI) {
      return <PageUI Store={Store} data={data}/>
    } else {
      if (type === 'grid') {
        return (
          <DetailGrid data={data} fields={fields} Store={Store}/>
        )
      }
      if (type === 'blocks') {
        return (<Blocks blocks={blocks} data={data} Store={Store}/>)
      }
    }
  }
}

@inject('Auth', 'UI') @observer
class Blocks extends Component {
  render() {
    const { data = {}, blocks = [], Auth, UI, Store } = this.props
    return (
      blocks.map((item, index) => {
        const { fields = [], dataKey = '', title = '', describe = '', style = {}, contentStyle = {}, show = true } = item
        const blockData = dataKey && data ? data[dataKey] : data || {}
        const isShow = typeof show === 'function' ? show({ data: blockData, Auth, UI }) : show
        if (!isShow) {
          return null
        }
        return (
          <div key={index} className="m-block" style={style}>
            {title && <h3>{title}{describe && <span style={{paddingLeft: '30px', fontSize: '0.8em'}}>{describe}</span>}</h3>}
            <div className="m-block-content" style={contentStyle}>
              <DetailGrid data={blockData} fields={fields} Store={Store}/>
            </div>
          </div>
        )
      })
    )
  }
}
