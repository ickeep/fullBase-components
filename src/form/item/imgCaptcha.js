import React, { Component } from 'react'
import { View } from 'react-native'
import { observer } from 'mobx-react'
import { Img, Link, Svg, InputItem, Toast } from 'Adapter'
import PropTypes from 'prop-types'
import Theme from '../../theme/rn'

@observer
export default class extends Component {
  static propTypes = {
    value: PropTypes.string,
    name: PropTypes.string,
    src: PropTypes.string,
    onChange: PropTypes.func,
    onGetImg: PropTypes.func
  }
  static defaultProps = {
    value: '',
    name: '',
    src: '',
    onChange: () => '',
    onGetImg: () => ''
  }
  click = async () => {
    const onGetImg = this.props.onGetImg
    typeof onGetImg === 'function' && onGetImg()
  }
  chang = (v) => {
    this.props.onChange(v)
  }
  showErr = () => {
    Toast.info(this.props.error)
  }

  render() {
    const { src, value, name, labelNumber, error } = this.props
    return (
      <View style={styles.wp}>
        <InputItem
          style={styles.codeBox}
          value={value}
          name={name}
          placeholder="验证码"
          labelNumber={labelNumber || 3}
          error={!!error}
          onChange={this.chang}
          onErrorClick={this.showErr}
          clear={true}>
          <Svg src="captcha"/>
        </InputItem>
        <Link onClick={this.click} style={styles.btn}>
          <Img src={src} style={styles.img}/>
        </Link>
      </View>
    )
  }
}

const btnWidth = 100
const styles = {
  wp: {
    position: 'relative'
  },
  captcha: {},
  codeBox: {
    paddingRight: btnWidth,
    position: 'relative'
  },
  btn: {
    position: 'absolute',
    top: 1,
    right: 1,
    height: Theme.list_item_height - 2,
    width: btnWidth
  },
  img: {
    width: btnWidth,
    height: Theme.list_item_height - 2,
  }
}
