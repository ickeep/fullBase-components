import { observable, action, computed } from 'mobx'
import Config from '../config'

const { validatedErrno, authErrno, successErrno, format } = Config

export interface IUI {
  pageTitle: string,

  setPageTitle(title: string): void

  clearMyMenu(): void

  site: {
    name: string,
    keywords: string,
    description: string
  }
  layout: { clientHeight: number, clientWidth: number, header: number },
  myMenu: { [key: string]: any },
  // selectedKeys: { [key: string]: any },
  leftMenuMap: { [key: string]: any },
  initDataLoading: boolean,
  // initData: Function
}

class UI implements IUI {
  constructor() {
    if (process.browser) {
      const { clientWidth, clientHeight } = document.documentElement
      this.setLayout({ clientWidth, clientHeight })
      window.onresize = () => {
        const { clientWidth, clientHeight } = document.documentElement
        this.setLayout({ clientWidth, clientHeight })
      }
    }
  }

  @observable pageTitle = ''
  setPageTitle = (title: string) => {
    this.pageTitle = title
  }
  @observable site = {
    name: '管理后台',
    keywords: ' 管理 后台',
    description: '管理后台'
  }
  @observable layout = { clientHeight: 600, scrollTop: 0, clientWidth: 800, header: 48 }
  @action setLayout = (obj: any): void => {
    this.layout = { ...this.layout, ...obj }
  }
  @observable myMenu = []
  @observable initDataLoading = false

  // @action
  // initData = async () => {
  //   this.initDataLoading = true
  //   if (this.myMenu.length < 1) {
  //     await this.getMyMenu()
  //   }
  //   this.initDataLoading = false
  // }

  @action
  clearMyMenu = () => {
    this.myMenu = []
  }
  //
  // @action
  // getMyMenu = async (): Promise<void> => {
  //   this.menuData = await getNav()
  //   if (this.menuData[format.errno] === successErrno) {
  //     this.myMenu = this.menuData[format.data] || []
  //   }
  // }

  @computed
  get leftMenuMap() {
    const map: { [key: string]: any } = {}
    this.myMenu && this.myMenu.forEach((item: any) => {
      map[item.path] = item.child || []
    })
    return map
  }
}

export default new UI()
