import { Config } from 'fullbase-components'

interface IConfig {
  hosts: { [key: string]: string },

  [key: string]: any
}

const config: IConfig = {
  ...Config,
  hosts: { api: '' },
}

if (process.env.REACT_APP_API_ENV === 'local') {
  config.hosts = {
    api: 'http://local-admin-api.ickeep.com',
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
    api: 'http://local-admin-api.ickeep.com',
  }
}

export default config
