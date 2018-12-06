import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Input } from 'antd'

const Search = Input.Search;
@observer
export default class  extends Component {
  constructor(props) {
    super(props)
    this.IntervalID = ''
    this.state = { remain: 0 }
  }

  componentWillUnmount() {
    clearTimeout(this.IntervalID)
  }

  getCode = async () => {
    const { remain } = this.state
    const { isAction, onGetCode } = this.props
    if (remain < 1 && isAction && typeof onGetCode === 'function') {
      const codeData = await onGetCode()
      if (codeData.errno === 0) {
        let remainNum = 60
        this.setState({ remain: remainNum })
        this.IntervalID = setInterval(() => {
          remainNum -= 1
          this.setState({ remain: remainNum })
          if (remainNum < 1) {
            clearTimeout(this.IntervalID)
          }
        }, 1000)
      }
    }
  }

  change = (e) => {
    const value = e.target.value
    this.props.onChange(value)
  }

  render() {
    const { value, isAction, placeholder = '验证码', autocomplete = 'off' } = this.props
    const { remain } = this.state
    return (
      <div>
        <Input
          autocomplete={autocomplete}
          placeholder={placeholder}
          value={value}
          clear={true}
          onChange={this.chang}
        >
          <Svg src="captcha"/>
        </Input>
        <a href="javascript:;" onClick={this.getCode}>
          <Text
            style={remain < 1 && isAction ? Style.btnText : Style.btnTextDis}>{remain > 0 ? `${remain}S` : `获取验证码`}</Text>
        </a>
      </div>)
  }
}
