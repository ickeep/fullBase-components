import { observable, action, computed } from 'mobx'
import Store from 'store'
import Config from '../config/config'

const { validatedErrno, authErrno, successErrno, format: { errno, errmsg } } = Config

interface IUser {
  id: number,
  name: string
}


export interface IAuth {
  dataFn: { [key: string]: (...args: any) => Promise<IResult> }
  dfUser: IUser,
  user: IUser,
  referrer: string,

  setUser(user?: IUser): void,

  setReferrer(url: string): void,

  getInfo(): Promise<IResult>,


  loginStatus: IFormStatus,
  loginForm: { username: string, password: string },
  loginErrs: { username: string, password: string },
  loginFormConf: any,

  login(): Promise<IResult>,

  logout(): Promise<IResult>,

  resetStatus: IFormStatus,
  resetForm: { username: string, captcha: string, password: string, rePassword: string },
  resetErrs: { username: string, captcha: string, password: string, rePassword: string },
  resetFormConf: any,

  reset(): Promise<IResult>,

  passwordInitStatus: IFormStatus,
  passwordInitForm: { username: string, oldPassword: string, newPassword: string, rePassword: string },
  passwordInitErrs: { username: string, oldPassword: string, newPassword: string, rePassword: string },
  passwordInitFormConf: any,

  passwordInit(): Promise<IResult>,

  passwordResetStatus: IFormStatus,
  passwordResetForm: { oldPassword: string, newPassword: string, rePassword: string },
  passwordResetErrs: { oldPassword: string, newPassword: string, rePassword: string },
  passwordResetFormConf: any,

  passwordReset(): Promise<IResult>,

}

@Form @Curd
class Auth implements IAuth {
  dataFn = { login, getInfo, reset, logout, getCode, passwordInit, passwordReset }
  dfUser = { id: 0, name: '' }
  @observable user: IUser = { ...this.dfUser, ...(Store.get('user') || {}) }
  @observable referrer: string = ''

  @action
  setUser = (userObj: IUser = this.dfUser) => {
    this.user = { ...this.user, ...userObj }
    Store.set('user', this.user)
  }

  @action
  setReferrer = (url: string): void => {
    this.referrer = url
  }

  // 登录
  dfLoginForm = { username: '', password: '' }
  @observable loginStatus: IFormStatus = { submit: false, loading: false }
  @observable loginForm = { ...this.dfLoginForm }
  @observable loginErrs = { username: '', password: '' }
  loginFormConf = {
    fields: [
      {
        field: 'username',
        type: 'input',
        span: 24,
        rules: 'required',
        aliasName: '用户名',
        props: { placeholder: '用户名' }
      },
      {
        field: 'password',
        type: 'input',
        span: 24,
        rules: 'required|password',
        aliasName: '密码',
        props: { type: 'password', placeholder: '密码' },
      }
    ]
  }

  @action
  login = async (): Promise<IResult> => {
    this.loginStatus.loading = true
    const userData = await this.dataFn.login(this.loginForm, '登录成功')
    const dataErrno = userData[errno]
    if (dataErrno === validatedErrno) {
      this.loginErrs = Object.assign(this.loginErrs, userData.data)
    } else if (dataErrno === successErrno) {
      this.setUser(userData.data.user)
      this.loginForm = { ...this.dfLoginForm }
    }
    this.loginStatus.loading = false
    return userData
  }

  // 获取用户信息
  @action
  getInfo = async () => {
    this.loginStatus.loading = true
    const userData = await this.dataFn.getInfo()
    const { code, data } = userData
    code === successErrno ? this.setUser(data) : this.setUser(this.dfUser)
    this.loginStatus.loading = false
    return userData
  }

  // 重置密码
  dfResetForm = { username: '', captcha: '', password: '', rePassword: '', }
  @observable resetStatus = { submit: false, loading: false }
  @observable resetForm = { ...this.dfResetForm }
  @observable resetErrs = { username: '', password: '', captcha: '', rePassword: '' }

  @computed get resetFormConf() {
    const { resetErrs: { username: eUsername }, resetForm: { username } } = this
    return {
      fields: [
        {
          field: 'username',
          type: 'input',
          span: 24,
          rules: 'required',
          aliasName: '用户名',
          props: { placeholder: '用户名' }
        },
        {
          field: 'captcha',
          type: 'captcha',
          span: 24,
          rules: 'required|captcha',
          aliasName: '验证码',
          props: {
            placeholder: '验证码',
            isActive: !eUsername && username,
            onGetCode: () => this.dataFn.getCode({ username })
          }
        },
        {
          field: 'password',
          type: 'input',
          span: 24,
          rules: 'required|password',
          aliasName: '密码',
          props: { type: 'password', placeholder: '密码', autoComplete: 'new-password' },
        },
        {
          field: 'rePassword',
          type: 'input',
          span: 24,
          rules: { required: '', password: '', equals: { field: 'password', original: '确认密码', equal: '密码' } },
          aliasName: '确认密码',
          props: { type: 'password', placeholder: '确认密码', autoComplete: 'new-password' },
        }
      ]
    }
  }

  @action
  reset = async (): Promise<IResult> => {
    this.resetStatus.loading = true
    const userData = await this.dataFn.reset(this.resetForm)
    if (userData[errno] === validatedErrno) {
      this.resetErrs = Object.assign(this.resetErrs, userData.data)
    } else if (userData[errno] === successErrno) {
      this.resetForm = { ...this.dfResetForm }
    }
    this.resetStatus.loading = false
    return userData
  }
  // 初始密码
  dfPasswordInitForm = { username: '', oldPassword: '', newPassword: '', rePassword: '' }
  @observable passwordInitStatus: IFormStatus = { submit: false, loading: false }
  @observable passwordInitForm = { ...this.dfPasswordInitForm }
  @observable passwordInitErrs = { ...this.dfPasswordInitForm }
  passwordInitFormConf = {
    fields: [
      {
        field: 'username',
        type: 'input',
        span: 24,
        rules: 'required',
        aliasName: '用户名',
        props: { placeholder: '用户名' }
      },
      {
        field: 'oldPassword',
        type: 'input',
        span: 24,
        rules: 'required|password',
        aliasName: '当前密码',
        props: { type: 'password', placeholder: '当前密码' },
      },
      {
        field: 'newPassword',
        type: 'input',
        span: 24,
        rules: 'required|password',
        aliasName: '新密码',
        props: { type: 'password', placeholder: '新密码' },
      },
      {
        field: 'rePassword',
        type: 'input',
        span: 24,
        rules: { required: '', password: '', equals: { field: 'newPassword', original: '确认密码', equal: '密码' } },
        aliasName: '确认密码',
        props: { type: 'password', placeholder: '确认密码' },
      }
    ]
  }

  @action
  passwordInit = async (): Promise<IResult> => {
    this.passwordInitStatus.loading = true
    const { username, oldPassword, newPassword } = this.passwordInitForm
    const userData = await this.dataFn.passwordInit({ username, oldPassword, newPassword })
    const { data } = userData
    if (userData[errno] === validatedErrno) {
      this.passwordInitErrs = Object.assign(this.passwordInitErrs, data)
    } else if (userData[errno] === successErrno) {
      this.passwordInitForm = { ...this.dfPasswordInitForm }
    }
    this.passwordInitStatus.loading = false
    return userData
  }


  @action
  logout = async () => {
    const outData = await this.dataFn.logout()
    if (outData[errno] === successErrno || outData.status === 204 || outData.status === 401) {
      outData[errno] = successErrno
      this.setUser(this.dfUser)
    }
    return outData
  }

  // 初始密码
  dfPasswordResetForm = { oldPassword: '', newPassword: '', rePassword: '' }
  @observable passwordResetStatus: IFormStatus = { submit: false, loading: false }
  @observable passwordResetForm = { ...this.dfPasswordResetForm }
  @observable passwordResetErrs = { ...this.dfPasswordResetForm }
  passwordResetFormConf = {
    props: { layout: 'inline' },
    fields: [
      {
        title: '当前密码',
        field: 'oldPassword',
        type: 'input',
        span: 24,
        rules: 'required|password',
        props: { type: 'password', placeholder: '当前密码' },
      },
      {
        field: 'newPassword',
        type: 'input',
        span: 24,
        rules: 'required|password',
        title: '新密码',
        props: { type: 'password', placeholder: '新密码', autoComplete: 'off' },
      },
      {
        field: 'rePassword',
        type: 'input',
        span: 24,
        rules: { required: '', password: '', equals: { field: 'newPassword', original: '确认密码', equal: '密码' } },
        title: '确认密码',
        props: { type: 'password', placeholder: '确认密码', autoComplete: 'off' },
      }
    ]
  }

  @action
  passwordReset = async (): Promise<IResult> => {
    this.passwordResetStatus.loading = true
    const resetData = await this.dataFn.passwordReset(this.passwordResetForm)
    if (resetData[errno] === validatedErrno) {
      this.resetErrs = Object.assign(this.resetErrs, resetData.data)
    } else if (resetData[errno] === successErrno) {
      this.passwordResetForm = { ...this.dfPasswordResetForm }
    }
    this.passwordResetStatus.loading = false
    return resetData
  }
}

export default new Auth() as Auth & ICurd & IForm
