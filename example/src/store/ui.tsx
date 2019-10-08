import { observable, action, computed } from 'mobx'
import { getNav } from '../api/admin'
import Config from '../config'
import { IResult } from 'fullbase-components/dist/unit/http';
import Http from "../api/http";

const { dfDataArr } = Http
const { codeSuccess, apiFormat } = Config

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
  @observable menuData: IResult = { ...dfDataArr }
  @observable myMenu = []
  @observable initDataLoading = false

  @action
  initData = async (): Promise<IResult> => {
    this.initDataLoading = true
    const menuData = this.myMenu.length < 1 ? await this.getMyMenu() : this.menuData
    this.initDataLoading = false
    return menuData
  }

  @action
  clearMyMenu = () => {
    this.myMenu = []
  }
  //
  @action
  getMyMenu = async (): Promise<IResult> => {
    this.menuData = await getNav()
    if (this.menuData[apiFormat.code] === codeSuccess) {
      this.myMenu = this.menuData[apiFormat.data] || []
    }
    return this.menuData
  }

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
