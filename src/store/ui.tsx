import { observable, action, computed } from 'mobx'
import { getNav } from '../api/user'
import Config from '../config/config'
import { IResult } from "../api/method";
import Store from 'store'

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
  menuData: IResult
  myMenu: { [key: string]: any },
  // selectedKeys: { [key: string]: any },
  leftMenuMap: { [key: string]: any },
  initDataLoading: boolean,
  initData: Function
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
    name: '喜茶管理后台',
    keywords: '喜茶 管理 后台',
    description: '喜茶管理后台'
  }
  @observable layout = { clientHeight: 600, scrollTop: 0, clientWidth: 800, header: 48 }
  @action setLayout = (obj: any): void => {
    this.layout = { ...this.layout, ...obj }
  }
  @observable menuData: IResult = { code: 0, msg: '', data: [] }
  @observable myMenu = []
  @observable initDataLoading = false

  @action
  initData = async () => {
    this.initDataLoading = true
    if (this.myMenu.length < 1) {
      await this.getMyMenu()
    }
    this.initDataLoading = false
  }

  @action
  clearMyMenu = () => {
    this.myMenu = []
    try {
      Store.remove('user_permission')
    } catch (err) {
      console.log(err, 'err')
    }
  }
  //
  @action
  getMyMenu = async (): Promise<void> => {
    this.menuData = await getNav()
    if (this.menuData[format.errno] === successErrno) {
      this.myMenu = this.menuData[format.data].moduleList || []
    }
  }

  @computed
  get leftMenuMap() {
    const map: { [key: string]: any } = {}
    this.myMenu && this.myMenu.forEach((item: any) => {
      map[item.path] = item.navList || []
    })
    return map
  }
}

export default new UI()
