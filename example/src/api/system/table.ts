import Http from '../http'

const { httpPost, httpGet } = Http

export function list(data: any) {
  return httpGet('/api/system/table/list', data)
}
