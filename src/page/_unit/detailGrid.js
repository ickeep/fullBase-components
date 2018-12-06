import React, { Component } from "react";
import { observer } from 'mobx-react'
import { Row, Col } from 'antd'
import DetailRender from './detailRender'
import './detailGrid.less'

function getRowArr(fields) {
  const rowArr = [[]]
  let spanLength = 0
  for (let i = 0; i < fields.length; i += 1) {
    const item = fields[i]
    if (item.type === 'none') {
      continue
    }
    spanLength = spanLength + (item.span || 12)
    if (spanLength > 24) {
      spanLength = item.span || 12
      rowArr.push([item])
    } else {
      const endNum = rowArr.length - 1
      if (!rowArr[endNum]) {
        rowArr[endNum] = []
      }
      rowArr[endNum].push(item)
    }
  }
  return rowArr
}

@observer
export default class DetailGrid extends Component {
  constructor(props) {
    super(props)
    const { fields = [] } = props
    this.rowArr = getRowArr(fields)
  }

  render() {
    const { data = {}, Store, scroll={} } = this.props
    return (
      <div className="m-detail-grid">
        {this.rowArr.map((row, index) => (
          <Row key={index}>
            {row.map((item, colIndex) => {
              const fieldsArr = item.field.split('.')
              let tmpData = Object.assign({}, data)
              for (let i = 0; i < fieldsArr.length; i += 1) {
                const tmpField = fieldsArr[i]
                if (typeof tmpData !== 'object') {
                  console.error(`详情页取值错误 field:${item.field}`)
                  break
                }
                tmpData = tmpData[tmpField]
              }
              const value = tmpData
              return (
                <Col key={colIndex} span={item.span || 12}>
                  <div className="u-col-content" style={item.style}>
                    {item.title && <span className="u-col-title">{item.title}:</span>}
                    {typeof item.render === 'function' ? item.render(value, data, index) :
                      <DetailRender data={data} item={item} value={value} Store={Store} scroll={scroll}/>
                    }
                  </div>
                </Col>
              )
            })}
          </Row>
        ))}
      </div>
    )
  }
}
