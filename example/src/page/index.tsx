import React, { Component } from 'react'
import { Full, Content, Link, Svg } from 'fullbase-components'
import { inject, observer } from 'mobx-react'
import UI, { IUI } from '../store/ui'
import './index.less'

@inject('UI') @observer
class App extends Component<{ UI?: IUI }> {
  componentDidMount() {
    const { UI } = this.props
    UI && UI.setPageTitle('首页')
  }

  render() {
    const { UI: { initDataLoading, myMenu } = UI } = this.props
    return (
      <Full className='l-index'>
        <Content code={0} loading={initDataLoading}>
          <div id="p-index">
            {!initDataLoading ? (myMenu && myMenu.length > 0) ?
              <div className="m-menu-box">
                {myMenu.map((menu: any) => (
                    <div className="u-menu-item" key={menu.path}>
                      <Link className="link" href={menu.path}>{menu.name}</Link>
                    </div>
                  )
                )}
              </div>
              :
              <div className="u-not-data">
                <Svg src="notData"/>
                <p className="text">你暂时没有任何系统的权限，请联系管理员</p>
              </div>
              : null
            }
          </div>
        </Content>
      </Full>
    )
  }
}

export default App
