import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Table, Button} from 'antd'
import {observer} from 'mobx-react'
import TableHeadFixed from './tableHeadFixed'

@observer
export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {tableEl: '', tableScrollTop: {top: 0, left: 0}}
  }

  OrderMap = {ascend: 'ASC', descend: 'DESC', ASC: 'ascend', DESC: 'descend'}
  change = (pagination, filters, sorter) => {
    if (sorter.field) {
      const onSorter = this.props.onSorter
      const oldSorter = this.props.sorter
      const orderVal = this.OrderMap[sorter.order]
      if (onSorter && (oldSorter.field !== sorter.field || oldSorter.val !== orderVal)) {
        onSorter({field: sorter.field, order: orderVal})
      }
    }
  }

  getSortOrder(field) {
    let order = ''
    const sorter = this.props.sorter || {}
    if (sorter.field === field) {
      order = this.OrderMap[sorter.val] || ''
    }
    return order
  }

  componentDidMount() {
    const table = this.refs.table
    if (table) {
      const tableEl = ReactDOM.findDOMNode(table)
      const tableBodyArr = tableEl.getElementsByClassName('ant-table-body')
      if (tableBodyArr && tableBodyArr[0]) {
        tableBodyArr[0].addEventListener('scroll', (e) => {
          this.setState({tableScroll: {top: e.target.scrollTop, left: e.target.scrollLeft}})
        })
      }
      this.setState({tableEl})
    }
  }

  getDataSource = () => {
    const props = this.props;
    const {data = {}, dataKey = 'data'} = props;
    return data[dataKey] && data[dataKey].slice ? data[dataKey].slice() : []
  };

  render() {
    const props = this.props
    const {tableEl, tableScroll} = this.state
    const {data = {}, operate = {}, rowKey = 'id', scroll, listTableActions, columns, rowSelection = null, searchMsg, _pagination, showPaginationTotal = true} = props
    const pagination = {
      ..._pagination,
      current: data.pageNum || data.currentPage || data.pageNumber,
      total: data.total || data.totals || data.totalCount,
      pageSize: parseInt(data.pageSize, 10),
      showSizeChanger: true,
      size: 'small'
    }
    if (this.props.showSizeChanger === false) {
      pagination.showSizeChanger = this.props.showSizeChanger
    }
    if (this.props.onPageSizeChange) {
      pagination.onShowSizeChange = this.props.onPageSizeChange
    }
    if (this.props.onPageChange) {
      pagination.onChange = this.props.onPageChange
    }
    return (
      <div className='m-list-table' data-operate-loading={operate.loading}>
        {showPaginationTotal && <p>符合条件的信息共 {pagination.total > 0 ? pagination.total : 0} 条
          共 {pagination.total > 0 ? Math.ceil(pagination.total / pagination.pageSize) : 0} 页 <span>{searchMsg}</span>
        </p>}
        <div className='u-table-row-selection-btn'>
          {listTableActions && listTableActions.map && listTableActions.map((item, index) =>
            <Button key={index}  {...item} >{item.children || '操作'}</Button>
          )}
        </div>
        <Table
          {...props}
          ref='table'
          bordered
          scroll={scroll}
          size="small"
          rowKey={rowKey}
          loading={props.loading || operate.loading || false}
          pagination={pagination}
          columns={columns}
          onChange={this.change}
          rowSelection={rowSelection}
          dataSource={this.getDataSource()}
        />
        <TableHeadFixed tableEl={tableEl} tableScroll={tableScroll}/>
      </div>
    )
  }
}
