import React, { Component, HTMLProps } from 'react'
import { observer, inject } from 'mobx-react'
import UI, { IUI } from "../../../store/ui"
import './tableHeadFixed.less'

interface IProps {
  UI?: IUI,
  tableEl: any,
  tableScroll: { left: number, top: number }
}

interface IState {
  tableFixed: boolean
}

// @ts-ignore
@inject('UI') @observer
export default class tableHeadFixed extends Component<IProps, IState> {
  //
  // state = { tableFixed: false }
  //
  //
  // static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
  //   const { UI: { layout } = { layout: { header: 0 } }, tableEl } = nextProps
  //   const { header } = layout
  //   if (tableEl && typeof tableEl.getBoundingClientRect === 'function') {
  //     const rect = tableEl.getBoundingClientRect()
  //     if (rect.top < header) {
  //       return { tableFixed: true }
  //     }
  //   }
  //   return { tableFixed: false }
  // }

  render() {
    return null
    //   const { tableFixed } = this.state
    //   const { UI: { layout } = UI, tableEl, tableScroll } = this.props
    //   const { clientWidth } = layout
    //   // const { clientWidth, scrollTop } = layout
    //   if (tableFixed) {
    //     const newTableEl: any = tableEl.cloneNode(true)
    //     const newTBodyArr = newTableEl.getElementsByTagName('tbody')
    //     const PaginationArr = newTableEl.getElementsByClassName('ant-pagination')
    //     for (let i = 0; i < newTBodyArr.length; i += 1) {
    //       const item = newTBodyArr[i]
    //       item.parentNode.removeChild(item)
    //     }
    //     for (let i = 0; i < PaginationArr.length; i += 1) {
    //       const item = PaginationArr[i]
    //       item.parentNode.removeChild(item)
    //     }
    //
    //     const headElArr = tableEl.getElementsByTagName('thead')
    //     // 去掉滚动条
    //     const tableBodyElArr = newTableEl.getElementsByClassName('ant-table-body')
    //     if (tableBodyElArr && tableBodyElArr[0]) {
    //       tableBodyElArr[0].style.overflowX = 'hidden'
    //     }
    //     if (headElArr.length > 0) {
    //       const newHeadElArr = newTableEl.getElementsByTagName('thead')
    //       const newHeadEl = newHeadElArr[0]
    //       const headEl = headElArr[0]
    //       const thElArr = headEl.getElementsByTagName('th')
    //       const newThElArr = newHeadEl.getElementsByTagName('th')
    //       for (let i = 0; i < newThElArr.length; i += 1) {
    //         const item = newThElArr[i]
    //         item.width = thElArr[i].offsetWidth
    //       }
    //       return (
    //         <div
    //           className={`m-list-table-fixed ${tableFixed ? 'z-fixed' : ''}`}
    //           style={{ width: tableEl.clientWidth, overflow: 'hidden' }}>
    //           <div
    //             className='m-list-table-fixed-content'
    //             style={{
    //               width: tableEl.clientWidth > headEl.clientWidth ? tableEl.clientWidth : headEl.clientWidth,
    //               overflow: 'hidden',
    //               position: 'relative',
    //               left: -(tableScroll.left || 0)
    //             }}
    //             // data-scrolltop={scrollTop}
    //             data-client-width={clientWidth}
    //             dangerouslySetInnerHTML={{ __html: newTableEl.innerHTML }}
    //           />
    //         </div>
    //       )
    //     }
    //   }
    //
    //   // return <div data-scrolltop={scrollTop} data-client-width={clientWidth} data-left={tableScroll.left}/>
    // }
  }
}
