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
  avatar: {
    icon: 'string',
    shape: 'circle|square',
    size: 'large|small|default',
    value: 'string',
    srcSet: 'string',
    alt: 'string',
  },
  tooltip: {
    arrowPointAtCenter: 'boolean',
    autoAdjustOverflow: 'boolean',
    defaultVisible: 'boolean',
    mouseEnterDelay: 'number',
    mouseLeaveDelay: 'number',
    overlayClassName: 'string',
    overlayStyle: 'object',
    placement: 'string',
    trigger: 'string',
    visible: 'boolean',
    value: 'string'
  },
  tab: {
    closable: 'boolean',
    color: 'string',
    visible: 'boolean',
    value: 'string',
  },
  progress: {
    type: 'line|circle|dashboard',
    percent: 'number',
    showInfo: 'boolean',
    status: 'success|exception|normal|active',
    strokeLinecap: 'round|square',
    strokeColor: 'string',
    successPercent: 'number',
  },
  divider: {
    value: 'string',
    dashed: 'boolean',
    orientation: 'left|right',
    type: 'horizontal|vertical',
  },
  link: {
    href: 'string',
    value: 'string',
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
  svg: { src: 'string' },
  tableColumn: {
    align: 'left|right|center',
    className: 'string',
    colSpan: 'number',
    dataIndex: 'string',
    defaultSortOrder: 'ascend|descend',
    filterDropdownVisible: 'boolean',
    filtered: 'boolean',
    filterMultiple: 'boolean',
    fixed: 'boolean',
    key: 'string',
    sortOrder: 'string',
    width: 'number',
  },
  tree: {
    value: 'string|array',
    data: 'string',
    valKey: 'string',
    labelKey: 'string',
    childKey: 'string',
    isRemoveParentKey: 'boolean',
    checkable: 'boolean',
    autoExpandParent: 'boolean',
    blockNode: 'boolean',
    checkStrictly: 'boolean',
    defaultExpandAll: 'boolean',
    defaultExpandParent: 'bool',
    disabled: 'bool',
    draggable: 'boolean',
    multiple: 'boolean',
    showIcon: 'boolean',
    showLine: 'boolean',
  }
}

export default {
  link: Link
}
