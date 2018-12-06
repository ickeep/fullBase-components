import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col } from 'antd'
import { observer } from 'mobx-react'
import ItemType from './itemType'

const FormItem = Form.Item
@observer
export default class EditForm extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    values: PropTypes.object,
    fields: PropTypes.array,
    errs: PropTypes.object,
    conf: PropTypes.object,
    data: PropTypes.object,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func
  }
  static defaultProps = {
    loading: false,
    fields: [],
    value: {},
    errs: {},
    conf: {},
    data: {},
    onChange: () => '',
    onSubmit: () => '',
  }

  submit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.onSubmit(e)
  }
  getRowArr = () => {
    const { fields } = this.props
    const rowArr = [[]]
    const lengthMap = {}
    let lengthMapKey = 0
    let spanLength = 0
    for (let i = 0; i < fields.length; i += 1) {
      const item = fields[i]
      if (item.type === 'none') {
        continue
      }
      spanLength = spanLength + (item.span || 12)
      if (spanLength > 24) {
        spanLength = item.span || 12
        lengthMapKey = 1
        rowArr.push([item])
      } else {
        lengthMapKey += 1
        const endNum = rowArr.length - 1
        if (!rowArr[endNum]) {
          rowArr[endNum] = []
        }
        rowArr[endNum].push(item)
      }
      const tmpLen = (item.title && item.title.length) || 0
      if (tmpLen > (lengthMap[lengthMapKey] || 0)) {
        lengthMap[lengthMapKey] = tmpLen
      }
    }
    return { rowArr, lengthMap }
  }

  render() {
    const { values, errs, conf, data, loading, inlineChild = false, children } = this.props
    this.getRowArr();
    conf.layout = conf.layout || 'horizontal'
    const { rowArr, lengthMap } = this.getRowArr()
    return (
      <Form className="m-edit-form" {...conf} onSubmit={this.submit}>
        {rowArr.map((row, index) => (
          <Row key={index} style={{ paddingBottom: conf.layout === 'inline' ? '10px' : 0 }}>
            {row.map((item, cI) => (
              <Col key={item.field} span={item.span || 12}>
                <FormItem
                  help={errs ? errs[item.field] || '' : ''}
                  validateStatus={errs && errs[item.field] ? 'error' : ''}
                  label={item.title ? <ItemLabel length={lengthMap[cI + 1]} label={item.title}/> : ''}
                  required={item.rules && item.rules.indexOf('required') >= 0}
                  colon={item.hasOwnProperty('colon') ? item.colon : true}
                >
                  <ItemType conf={item} values={values} data={data} onChange={this.props.onChange} loading={loading}/>
                </FormItem>
              </Col>
            ))}
            {index === rowArr.length - 1 && inlineChild && children}
          </Row>
        ))}
        {!inlineChild && children}
      </Form>
    )
  }
}

class ItemLabel extends Component {
  render() {
    const { length = 0, label } = this.props
    if (!label) {
      return null
    }
    return <span style={{ width: 14 * length, display: 'inline-block' }}>{label}</span>
  }
}
