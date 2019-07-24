import { Link } from 'fullbase-components'

export const typeProps = {
  link: {
    href: 'string',
    children: 'string'
  },
  currency: {
    sign: 'string',
    fixed: 'number',
  },
  datetime: {
    format: 'string'
  },
  idCardEncrypt: {
    startLen: 'number',
    endLen: 'number',
    sign: 'string',
  },
  keyToValue: {
    data: 'string',
    color: 'string',
    colors: 'string',
    isTag: 'boolean'
  },
  phoneEncrypt: {
    startLen: 'number',
    endLen: 'number',
    sign: 'string',
  },
  svg: { src: 'string' }
}

export default {
  link: Link
}
