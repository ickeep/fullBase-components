import { HTTP } from 'fullbase-components'
import Store from 'store'
import Config from '../config'
import { IBeforeFn, IBeforeFnOpt } from 'fullbase-components/dist/unit/http'

const beforeFn: IBeforeFn = function ({ url, data, conf = {} }: IBeforeFnOpt) {
  const opt: IBeforeFnOpt = { url: url, data, conf }
  const { hosts } = Config
  opt.url = url.replace(/^\/([\w\d]+)\//, (a1, a2) => a2 && hosts[a2] ? `${hosts[a2]}/` : a1)
  const token = Store.get('token')
  if (token) {
    !conf.headers && (conf.headers = {})
    conf.headers.Authorization = 'bearer ' + token
  }
  return opt
}


export default HTTP({ beforeFn })
