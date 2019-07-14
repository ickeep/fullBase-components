import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Button, Col, Form as FormC, Row, Radio, InputNumber } from 'antd'
import { Curd, Form, Input, Select, Link } from 'fullbase-components'

const typeData: string[] = ['cascader', 'checkbox', 'input', 'inputNumber', 'radio', 'rangeDate', 'select', 'selectRemote', 'selectTree', 'timestamp']


// window.xxx = [].rows
// window.tmpStr = ''
// for (let i = 1; i < window.xxx.length; i += 1) {
//   const item = window.xxx[i]
//   let value = item.cells[2].innerText
//   if (value !== 'function(e)') {
//     value = value.replace('string|ReactNode', 'string')
//     window.tmpStr += `${item.cells[0].innerText}: '${value}',`
//   }
// }
// console.log(window.tmpStr);
const typeProps = {
  input: {
    icon: 'string',
    addonAfter: 'string',
    addonBefore: 'string',
    defaultValue: 'string',
    disabled: 'boolean',
    id: 'string',
    prefix: 'string',
    size: 'string',
    suffix: 'string',
    type: 'string',
    value: 'string',
    allowClear: 'boolean',
  },
  checkbox: {
    value: 'string|array',
    labelKey: 'string',
    valKey: 'string',
    split: 'string',
  },
  radio: {
    value: 'string|number',
    isAll: 'boolean',
    type: 'string',
    valKey: 'string',
    labelKey: 'string',
  },
  rangeDate: {
    allowClear: 'boolean',
    autoFocus: 'boolean',
    disabled: 'boolean',
    dropdownClassName: 'string',
    mode: 'time|date|month|year|decade',
    open: 'boolean',
    placeholder: 'string',
    size: 'string',
  },
  cascader: {
    allowClear: 'boolean',
    autoFocus: 'boolean',
    disabled: 'boolean',
    expandTrigger: 'click|hover',
    notFoundContent: 'string',
    placeholder: 'string',
    popupClassName: 'string',
    popupPlacement: 'bottomLeft|bottomRight|topLeft|topRight',
    popupVisible: 'boolean',
    showSearch: 'boolean',
    size: 'large|default|small',
    value: 'string|array',
    valIsArr: 'boolean',
    split: 'string',
    changeOnSelect: 'boolean',
  },
  inputNumber: {
    autoFocus: 'boolean',
    defaultValue: 'number',
    disabled: 'boolean',
    max: 'number',
    min: 'number',
    precision: 'number',
    decimalSeparator: 'string',
    size: 'string',
    step: 'number',
    value: 'number',
  },
  select: {
    allowClear: 'boolean',
    autoClearSearchValue: 'boolean',
    autoFocus: 'boolean',
    defaultActiveFirstOption: 'boolean',
    disabled: 'boolean',
    dropdownMatchSelectWidth: 'boolean',
    firstActiveValue: 'string',
    labelInValue: 'boolean',
    maxTagCount: 'number',
    maxTagTextLength: 'number',
    mode: 'multiple|tags',
    notFoundContent: 'string',
    optionFilterProp: 'string',
    optionLabelProp: 'string',
    showArrow: 'boolean',
    size: 'large|small',
    tokenSeparators: 'string',
    defaultOpen: 'boolean',
    open: 'boolean',
    loading: 'boolean',
    value: 'string|array|number',
    isNull: 'boolean',
    vToString: 'boolean',
    splitKey: 'string',
    labelKey: 'string',
    valKey: 'string',
    showSearch: 'boolean',
    placeholder: 'string',
  },
  selectTree: {
    allowClear: 'boolean',
    autoClearSearchValue: 'boolean',
    disabled: 'boolean',
    dropdownMatchSelectWidth: 'boolean',
    labelInValue: 'boolean',
    maxTagCount: 'number',
    multiple: 'boolean',
    placeholder: 'string',
    searchPlaceholder: 'string',
    searchValue: 'string',
    treeIcon: 'boolean',
    showCheckedStrategy: 'TreeSelect.SHOW_ALL|TreeSelect.SHOW_PARENT|TreeSelect.SHOW_CHILD',
    showSearch: 'boolean',
    size: 'large|small',
    treeCheckable: 'boolean',
    treeCheckStrictly: 'boolean',
    treeDefaultExpandAll: 'boolean',
    treeNodeFilterProp: 'string',
    treeNodeLabelProp: 'string',
    value: 'number|string|array',
    multipleToStr: 'boolean',
    valKey: 'string',
    split: 'string',
    labelKey: 'string',
    childKey: 'string',
  },
  timestamp: {
    value: 'string|number',
    format: 'string',
  },
  selectRemote: {}

}
@observer
export default class WhereConf extends Component<any> {
  add = () => {
    const { value = [], onChange, values, field } = this.props
    value.push({ title: '', field: '', type: '', props: [], span: 8, rules: '', dfVal: '' })
    values[field] = value
    onChange(values)
  }
  cut = (index: number) => {
    const { value = [], onChange, values, field } = this.props
    value.splice(index, 1)
    values[field] = value
    onChange(values)
  }
  change = (v: any, i: number, type: string) => {
    const { value = [], onChange, values, field, } = this.props
    value[i][type] = v
    if (type === 'type') {
      value[i].props = []
      value[i].dfVal = ''
    }
    values[field] = value
    onChange(values)
  }
  dfValChange = (e: any, index: number) => {
    const { value = [], onChange, values, field } = this.props
    value[index].dfVal = e.target.value
    values[field] = value
    onChange(values)
  }

  render() {
    const { value = [], dict } = this.props
    const { apiDetail, tableDetail } = dict
    const { optFields } = apiDetail
    const { fields: fieldsConf } = tableDetail
    let fieldsData: string[] = []
    if (optFields) {
      fieldsData = optFields.splice(',')
    } else {
      fieldsData = fieldsConf ? Object.keys(fieldsConf) : []
    }
    return <div>{value.map((item: any, index: number) =>
      <div key={index} style={{ width: '100%', background: '#eee', padding: '10px', marginBottom: '10px' }}>
        <Row>
          <Col span={8}>
            <FormC.Item label="标题">
              <Input value={item.title} onChange={(v: string) => this.change(v, index, 'title')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="字段">
              <Select value={item.field} mode={item.type === 'rangeDate' ? 'multiple' : 'tags'} data={fieldsData}
                      onChange={(v) => this.change(v, index, 'field')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="type">
              <Select value={item.type} data={typeData} onChange={(v) => this.change(v, index, 'type')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="span">
              <Select value={item.span} data={[1, 2, 3, 4, 6, 8, 12, 24]}
                      onChange={(v) => this.change(v, index, 'span')}/>
            </FormC.Item>
          </Col>
          <Col span={16}>
            <FormC.Item label="默认值">
              <DfVal value={item.dfVal} type={typeProps[item.type] && typeProps[item.type].value || ''}
                     onChange={(v: any) => this.change(v, index, 'dfVal')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="校验规则">
              <Input value={item.rules} onChange={(v: string) => this.change(v, index, 'rules')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <FormC.Item label="数据">
              <Input value={item.data} onChange={(v: string) => this.change(v, index, 'data')}/>
            </FormC.Item>
          </Col>
          <Col span={8}>
            <Button onClick={() => this.cut(index)}>-</Button>
          </Col>
          {item.type &&
          <Col span={24}>
            <FormC.Item label="props">
              <PropsEdit value={item.props} data={typeProps[item.type]}
                         onChange={(v: any[]) => this.change(v, index, 'props')}/>
            </FormC.Item>
          </Col>}
        </Row>
      </div>
    )}
      <Button onClick={this.add}>+</Button>
    </div>
  }
}

@observer
class PropsEdit extends Component<any> {
  add = () => {
    const { value = [], onChange } = this.props
    value.push({ type: '', val: '' })
    onChange(value)
  }
  cut = (index: number) => {
    const { value = [], onChange } = this.props
    value.splice(index, 1)
    onChange(value)
  }
  change = (v: any, index: number, type: string) => {
    const { value = [], onChange } = this.props
    value[index][type] = v
    if (type === 'type') {
      value[index].val = ''
    }
    onChange(value)
  }

  render() {
    const { data = {}, value = [] } = this.props
    return <div>{value.map((item: any, index: number) =>
      <div key={index} style={{ background: '#ddd', padding: '10px', marginBottom: '10px', minWidth: '680px' }}>
        <Row>
          <Col span={8}>
            <FormC.Item label="key">
              <Select value={item.type} data={Object.keys(data)} onChange={(v) => this.change(v, index, 'type')}/>
            </FormC.Item>
          </Col>
          {item.type &&
          <Col span={12}>
            <FormC.Item label="val">
              <PropVal value={item.val} type={data[item.type]} onChange={(v: any) => this.change(v, index, 'val')}/>
            </FormC.Item>
          </Col>
          }
          <Col span={4}>
            <Button onClick={() => this.cut(index)}>-</Button>
          </Col>
        </Row>
      </div>)}
      <Button onClick={this.add}>+</Button>
    </div>
  }
}

@observer
class PropVal extends Component<any> {
  change = (e: any) => {
    const { onChange } = this.props
    onChange(e.target.value)
  }

  render() {
    const { type, value, onChange } = this.props
    const typeArr = type.split('|')
    if (type === 'string') {
      return <Input value={value} onChange={onChange}/>
    }
    if (type === 'number') {
      return <InputNumber value={value} onChange={onChange}/>
    }
    if (type === 'boolean') {
      return <Radio.Group onChange={this.change} value={value}>
        <Radio value={true}>true</Radio>
        <Radio value={false}>false</Radio>
      </Radio.Group>
    }
    if (typeArr.length > 1) {
      return <Select value={value} data={typeArr} onChange={onChange}/>
    }
  }
}

@observer
class DfVal extends Component<any> {
  render() {
    const { value, type, onChange } = this.props
    if (!type) {
      return <div>请选择类型</div>
    }
    const typeArr = type.split('|')
    return <div>
      <div style={{ display: 'inline-block' }}>
        <Radio.Group onChange={(e: any) => onChange(e.target.value)} value={value}>
          {typeArr.indexOf('boolean') >= 0 &&
          <>
            <Radio value={true}>true</Radio>
            <Radio value={false}>false</Radio>
          </>
          }
          {typeArr.indexOf('array') >= 0 &&
          <Radio value={'_[]'}>[]</Radio>
          }
          {typeArr.indexOf('object') >= 0 &&
          <Radio value={'_{}'}>{'{}'}</Radio>
          }
          {typeArr.length > 1 && typeArr.indexOf('string') >= 0 &&
          <Radio value={''}>string</Radio>
          }
          {typeArr.length > 1 && typeArr.indexOf('number') >= 0 &&
          <Radio value={0}>number</Radio>
          }
        </Radio.Group>
      </div>
      {(value !== '_{}' && value !== '_[]') &&
      <div style={{ display: 'inline-block' }}>
        {(type === 'string' || typeof value === 'string' && type !== 'number') &&
        <Input value={value} onChange={onChange}/>}
        {(type === 'number' || typeof value === 'number' && type !== 'string') &&
        <InputNumber value={value} onChange={onChange}/>}
      </div>
      }
    </div>
  }
}
