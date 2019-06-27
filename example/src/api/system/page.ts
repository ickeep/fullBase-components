import Http from '../http'

const { httpPost, httpGet } = Http

export function list(data: any) {
  return httpGet('/page/system/page/list', data)
}

export function detail(data: any) {
  return httpGet('/page/system/page/detail', data)
}

export function add(data: any) {
  return httpPost('/page/system/page/add', data)
}

export function edit(data: any) {
  return httpPost('/page/system/page/edit', data)
}
