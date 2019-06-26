import Http from '../http'

const { httpPost, httpGet } = Http

export function list(data: any) {
  return httpGet('/api/system/api/list', data)
}

// export function getFields({ db, name }: { db: string, name: string }) {
//   return httpGet('/api/system/api/getFields', { db, name })
// }

export function detail(data: any) {
  return httpGet('/api/system/api/detail', data)
}

export function add(data: any) {
  return httpPost('/api/system/api/add', data)
}

export function edit(data: any) {
  return httpPost('/api/system/api/edit', data)
}
