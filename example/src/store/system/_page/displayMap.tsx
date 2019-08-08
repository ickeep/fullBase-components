import { Link } from 'fullbase-components'

export const typeProps = {
  button: {
    type: 'primary|dashed|danger|link',
    size: 'small|large',
    disabled: 'boolean',
    ghost: 'boolean',
    href: 'string',
    htmlType: 'string',
    icon: 'string',
    loading: 'boolean',
    shape: 'circle|round',
    target: 'string',
    block: 'boolean',
  },
  link: {
    href: 'string',
    children: 'string'
  },
  currency: {
    sign: 'string',
    fixed: 'number',
    value: 'string',
  },
  datetime: {
    format: 'string',
    value: 'string',

  },
  idCardEncrypt: {
    startLen: 'number',
    endLen: 'number',
    sign: 'string',
    value: 'string',
  },
  keyToValue: {
    data: 'string',
    color: 'string',
    colors: 'string',
    isTag: 'boolean',
    value: 'string',
  },
  phoneEncrypt: {
    startLen: 'number',
    endLen: 'number',
    sign: 'string',
    value: 'string',
  },
  svg: { src: 'string' }
}

export default {
  link: Link
}
