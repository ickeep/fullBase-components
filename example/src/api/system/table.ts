import Http from '../http'

const { httpPost, httpGet } = Http

export function list(data: any) {
  return httpGet('/api/system/table/list', data)
}

export function getFields({ db, name }: { db: string, name: string }) {
  return httpGet('/api/system/table/getFields', { db, name })
}
