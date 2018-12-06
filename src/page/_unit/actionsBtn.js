import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {observer, inject} from 'mobx-react'
import {withRouter} from 'react-router-dom'
import {Button} from 'antd'
import Link from '../../../components/_unit/link'


@withRouter @inject('UI') @observer
export default class ActionBtn extends Component {
  constructor(props) {
    super(props)
    this.state = {btnFixed: false, btnEl: ''}
  }

  componentDidMount() {
    const btnWp = this.refs.btnWp
    if (btnWp) {
      this.setState({btnEl: ReactDOM.findDOMNode(btnWp)})
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {btnEl} = prevState
    const {UI = {}} = nextProps
    const {clientHeight} = UI.layout || {}
    if (btnEl && typeof btnEl.getBoundingClientRect === 'function') {
      const rect = btnEl.getBoundingClientRect()
      if (rect.bottom > clientHeight) {
        return {btnFixed: true}
      }
    }
    return {btnFixed: false}
  }

  onClick = (item) => {
    let {history} = this.props;
    item.onClick && item.onClick(history);
  };

  render() {
    const {actions, history, location, btnConf, UI} = this.props
    const {btnFixed, btnEl} = this.state
    const {ifEdit = true, ifBack = true} = btnConf
    const {search, pathname} = location
    const {layout} = UI
    const {clientWidth, scrollTop} = layout
    const width = btnEl && btnEl.querySelector('.content') ? btnEl.querySelector('.content').offsetWidth : btnEl.offsetWidth;
    const style = {}
    if (width && btnFixed) {
      style.width = width - 16
    }
    return (

      <div ref='btnWp' className='m-page-bottom-actions-wp' data-scroll-top={scrollTop} data-client-width={clientWidth}>
        <div className={`m-page-bottom-actions z-index-back-top ${btnFixed ? 'z-fixed' : ''}`} style={style}>
          {actions && actions.map && actions.map((item, index) =>
            <span style={{marginRight: '16px'}} key={index}>
              <Button className='u-detail-Actions-btn' key={index}  {...item}
                      onClick={() => this.onClick(item)}>{item.children || '操作'}</Button>
            </span>
          )}
          {ifEdit &&
          <Link href={pathname.replace(/\/detail$/, '/edit') + search}>
            <Button type="primary" className="btn-edit">修改</Button>
          </Link>
          }
          {ifBack && <Button onClick={history.goBack}>返回</Button>}
        </div>
      </div>
    )
  }
}
