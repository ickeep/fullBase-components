export function treeToMap({ tree, valKey = 'id', childKey = 'children' }: { tree: object[], valKey?: string, childKey?: string }) {
  let map = {}
  for (let i = 0; i < tree.length; i += 1) {
    const item = tree[i]
    map[item[valKey]] = item
    const child = item[childKey]
    if (child && child.length > 0) {
      const childMap = treeToMap({ tree: child, valKey, childKey })
      map = { ...map, ...childMap }
    }
  }
  return map
}

export interface IGetSelectTree {
  tree: object[],
  select: string[],
  map?: object,
  valKey?: string,
  childKey?: string
  parentKey?: string,
  rootVal?: string,
}

function getParentIds({ treeIdMap = {}, id = '', parentKey = 'parentId', select = [] }: { treeIdMap: object, id: string, parentKey: string, select: string[] }) {
  let ids: string[] = []
  const idItem = treeIdMap[id] || {}
  const parentId = idItem[parentKey]
  if (typeof parentId !== 'undefined' && select.indexOf(parentId) < 0) {
    ids.push(parentId)
    treeIdMap[parentId] ? ids = ids.concat(getParentIds({ parentKey, treeIdMap, id: parentId, select })) : ''
  }
  return ids
}

export function getTree({ data = [], parentIdMap = {}, childKey = 'children', valKey = 'id', }: { data: object[], parentIdMap: object, childKey?: string, valKey?: string, }) {
  const newTree: any[] = []
  for (let i = 0; i < data.length; i += 1) {
    const item = { ...data[i] }
    const id = item[valKey]
    const childData = parentIdMap[id]
    if (childData) {
      item[childKey] = getTree({ data: childData, parentIdMap, childKey, valKey })
    } else {
      item[childKey] = null
    }
    newTree.push(item)
  }
  return newTree
}

export function getChildSelectedTree({ tree = [], selectMap = {}, valKey = 'id', childKey = 'children' }: { tree: object[], selectMap: object, valKey?: string, childKey?: string }) {
  const newTree = []
  for (let i = 0; i < tree.length; i += 1) {
    const item = tree[i]
    if (selectMap[item[valKey]]) {
      const newItem = { ...item }
      newItem[childKey] ? newItem[childKey] = getChildSelectedTree({
        tree: newItem[childKey],
        selectMap,
        valKey,
        childKey
      }) : ''
      newTree.push(newItem)
    }
  }
  return newTree
}

export function getSelectTree({ tree, select, map, valKey = 'id', childKey = 'children', parentKey = 'parentId', rootVal = '0' }: IGetSelectTree) {
  const treeIdMap = map ? map : treeToMap({ tree, valKey, childKey })
  let newSelect = select.slice()
  for (let i = 0; i < select.length; i += 1) {
    const id = select[i]
    newSelect = newSelect.concat(getParentIds({ treeIdMap, id, parentKey, select: newSelect }))
  }
  const selectMap: { [key: string]: any } = {}
  newSelect.forEach((v: string) => selectMap[v] = true)
  return getChildSelectedTree({ tree, selectMap, valKey, childKey })

  // const parentIdMap = {}
  // newSelect = Object.keys(selectMap)
  // for (let i = newSelect.length - 1; i >= 0; i -= 1) {
  //   const id = newSelect[i]
  //   const idItem = treeIdMap[id]
  //   if (idItem) {
  //     const parentId = idItem[parentKey]
  //     if (!parentIdMap[parentId]) {
  //       parentIdMap[parentId] = []
  //     }
  //     parentIdMap[parentId].push(idItem)
  //   }
  // }
  // return getTree({ data: parentIdMap[rootVal], childKey, valKey, parentIdMap })
}
