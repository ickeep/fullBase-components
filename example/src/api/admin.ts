import Http from './http'
import Store from 'store'

const { httpGet, httpPost, httpPatch } = Http

interface ILogin {
  name: string,
  password: string
}

interface IPasswordInit {
  username: string,
  oldPassword: string
  newPassword: string
}

interface IPasswordReset {
  oldPassword: string
  newPassword: string
}

export function getInfo() {
  return httpGet('/api/index', '', false)
}

export function getNav() {
  return httpPost('/api/rbac/privilege/my', '', false)
}

export async function login(data: ILogin, tips: boolean | string = false) {
  const loginData = await httpPost('/api/login', data, tips)
  if (loginData.code === 0) {
    const token = loginData.headers && loginData.headers.token
    token && Store.set('token', token)
  }
  return loginData
}

export async function passwordInit(data: IPasswordInit, tips: boolean | string = false) {
  return httpPatch('/api/user/password/reset/first', data, tips)
}

interface IReset {
  username: string,
  captcha: string,
  password: string,
}

export async function getImgCaptcha(type: string) {
  return httpPost('/api/captcha/img', { action: type })
}

export async function getPhoneCaptcha(type: string) {
  return httpPost('/api/captcha/phone', { action: type })
}

export async function getMailCaptcha(type: string) {
  return httpPost('/api/captcha/mail', { action: type })
}

export async function getCode({ username = '' }: { username: string }) {
  return httpPost('/api/user/forgetPassword', { username })
}

export async function reset(data: IReset, tips: boolean | string = false) {
  return httpPost('/api/forgetPassword', data, tips)
}

export async function passwordReset(data: IPasswordReset, tips: boolean | string = true) {
  return httpPost('/api/password/change', data, tips)
}

export async function logout(data?: IReset, tips: boolean | string = false) {
  return httpPost('/api/logout', data, tips)
}
