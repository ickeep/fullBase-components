import React, { Component } from 'react'
import { Svg, Captcha, Link, Cascader, Checkbox, ImgCaptcha, Input, Radio } from 'fullbase-components'

/*<Provider Auth={Auth} UI={UI}>*/

class App extends Component {
  render() {
    // @ts-ignore
    return (
      <div>
        <Link href='/login'>登录</Link>
        <Svg src="404"/>
        <Captcha/>
        <Checkbox data={[2, 3, 4]}/>
        <Cascader/>
        <ImgCaptcha/>
        <Input/>
        <Radio data={{ 1: '111111', 2: '2222222' }}/>
      </div>
    )
  }

}

export default App
