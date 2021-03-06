import Http from '../http'

const { httpPost, httpGet } = Http

export function rows() {
  return httpGet('/api/system/db/rows')
}

export function tableRows(db: string) {
  return httpGet('/api/system/db/tableRows', { db })
}
