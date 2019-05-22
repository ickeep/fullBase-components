import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Table, Button } from 'antd'
import { TableProps } from 'antd/lib/table/interface'
import { observer } from 'mobx-react'

// import TableHeadFixed from './tableHeadFixed'

interface IProps extends TableProps<any> {
  showSizeChanger?: boolean
  loading?: boolean,
  onSorter?: Function,
  sorter?: { field: string, val: string },
  data?: { [key: string]: any },
  dataKey?: string,
  searchMsg?: string,
  operate: { [key: string]: any },
  listTableActions?: any[],
  showPaginationTotal?: boolean
  pagination?: any
}

interface IState {
  tableEl: any,
  tableScroll: { top: number, left: number }
}

@observer
export default class extends Component<IProps, IState> {
  // state = { tableEl: '', tableScroll: { top: 0, left: 0 } }
  // tableNode: any = ''
  OrderMap = { ascend: 'ASC', descend: 'DESC', ASC: 'ascend', DESC: 'descend' }
  change = (pagination: any, filters: any, sorter: any) => {
    const { field, order } = sorter
    if (field) {
      const { onSorter, sorter: { field: oldField = '', val: OldVal = '' } = {} } = this.props
      const orderVal = this.OrderMap[order]
      if (onSorter && (oldField !== field || OldVal !== orderVal)) {
        onSorter({ field, order })
      }
    }
  }

  componentDidMount() {
    // const table = this.tableNode
    // if (table && typeof table !== 'string') {
    //   const tableEl: any = ReactDOM.findDOMNode(table)
    //   const tableBodyArr = tableEl && typeof tableEl === 'object' && tableEl.getElementsByClassName('ant-table-body')
    //   if (tableBodyArr && tableBodyArr[0]) {
    //     tableBodyArr[0].addEventListener('scroll', (e: any) => {
    //       this.setState({ tableScroll: { top: e.target.scrollTop, left: e.target.scrollLeft } })
    //     })
    //   }
    //   this.setState({ tableEl })
    // }
  }

  getDataSource = () => {
    const props = this.props;
    const { data = {}, dataKey = 'data' } = props;
    return data[dataKey] && data[dataKey].slice ? data[dataKey].slice() : []
  };

  render() {
    const props = this.props
    // const { tableEl, tableScroll } = this.state
    const { operate = {}, rowKey = 'id', scroll, listTableActions, pagination, showPaginationTotal = true } = props
    return (
      <div className='m-list-table' data-operate-loading={operate.loading}>
        {showPaginationTotal && pagination && pagination.total > 0 ?
          <p>符合条件的信息共 {pagination.total} 条 共 {Math.ceil(pagination.total / pagination.pageSize)} 页</p> :
          <p>暂无数据</p>
        }
        <div className='u-table-row-selection-btn'>
          {listTableActions && listTableActions.map && listTableActions.map((item, index) =>
            <Button key={index}  {...item} >{item.children || '操作'}</Button>
          )}
        </div>
        <Table
          {...props}
          // ref={ref => this.tableNode = ref}
          bordered
          scroll={scroll}
          size="small"
          rowKey={rowKey}
          loading={props.loading || operate.loading || false}
          pagination={pagination}
          onChange={this.change}
          dataSource={this.getDataSource()}
        />
        {/*<TableHeadFixed tableEl={tableEl} tableScroll={tableScroll}/>*/}
      </div>
    )
  }
}