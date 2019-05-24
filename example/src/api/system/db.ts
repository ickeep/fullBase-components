import Http from '../http'

const { httpPost, httpGet } = Http

export function rows() {
  return httpGet('/api/system/db/rows')
}
