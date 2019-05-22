import React, { Component } from 'react'
import { Svg, Captcha } from 'fullbase-components'
import { Link } from 'react-router-dom'


/*<Provider Auth={Auth} UI={UI}>*/

class App extends Component {
  render() {
    // @ts-ignore
    return (
      <div>
        {/*<Link href="/login">login</Link>*/}
        <Link to='login'>登录</Link>
        <Svg src="404"/>

        <Captcha/>
      </div>
    )
  }

}

export default App
