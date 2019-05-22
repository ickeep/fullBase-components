import React, { Component } from 'react'
import { Svg, Captcha, Link } from 'fullbase-components'

/*<Provider Auth={Auth} UI={UI}>*/

class App extends Component {
  render() {
    // @ts-ignore
    return (
      <div>
        <Link href='/login'>登录</Link>
        <Svg src="404"/>
        <Captcha/>
      </div>
    )
  }

}

export default App
