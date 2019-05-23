export interface IConfig {
  codeSuccess: number,
  codeUnauthorized: number,
  codeValidated: number,
  codeNotConf: number,
  apiFormat: {
    code: string,
    msg: string,
    data: string,
    page: string,
    pageSize: string,
    currentPage: string,
    count: string,
    totalPages: string
  }
}

const Config: IConfig = {
  codeSuccess: 0,
  codeUnauthorized: 401001,
  codeValidated: 403001,
  codeNotConf: 402001,
  apiFormat: {
    code: 'code',
    msg: 'msg',
    data: 'data',
    page: 'page',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    count: 'count',
    totalPages: 'totalPages'
  }
}

export default Config
