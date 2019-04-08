interface IConfig {
  hosts: { [key: string]: string }
  successErrno: number,
  authErrno: number,
  validatedErrno: number,
  mobileWidth: number,
  format: {
    errno: string,
    errmsg: string,
    data: string,
    page: string,
    pageSize: string,
    currentPage: string,
    count: string,
    totalPages: string
  },
}

const config: IConfig = {
  hosts: { api: '' },
  successErrno: 0,
  authErrno: 401,
  validatedErrno: 403001,
  mobileWidth: 768,
  format: {
    errno: 'code',
    errmsg: 'msg',
    data: 'data',
    page: 'page',
    pageSize: 'size',
    currentPage: 'current',
    count: 'total',
    totalPages: 'totalPage'
  },
}

if (process.env.REACT_APP_API_ENV === 'local') {
  config.hosts = {
    api: '//20.10.28.252:30010',
  }
} else if (process.env.REACT_APP_API_ENV === 'dev') {
  config.hosts = {
    api: '//test.heytea.com',
  }
} else if (process.env.REACT_APP_API_ENV === 'test-base') {
  config.hosts = {
    api: 'https://test.heytea.com',
  }
} else if (process.env.REACT_APP_API_ENV === 'test-sale') {
  config.hosts = {
    api: '//test.heytea.com',
  }
} else if (process.env.REACT_APP_API_ENV === 'test-member') {
  config.hosts = {
    api: '//test.heytea.com',
  }
} else if (process.env.REACT_APP_API_ENV === 'pre') {
  config.hosts = {
    api: 'https://staging.heytea.com',
  }
} else if (process.env.REACT_APP_API_ENV === 'prod') {
  config.hosts = {
    api: 'https://go.heytea.com',
  }
} else {
  config.hosts = {
    api: '//20.10.28.252:8899',
  }
}

export default config
