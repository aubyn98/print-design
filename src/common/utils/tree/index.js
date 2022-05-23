export function filterTree(tree, id) {
  return tree
    .map(item => {
      if (item.id === id) return null
      return { ...item, children: filterTree(item.children, id) }
    })
    .filter(item => item)
}
export function getTreeItem(tree, key, val) {
  return tree
    .map(item => {
      if (item[key] === val) return item
      else {
        if (item.children?.length) return getTreeItem(item.children, key, val)
      }
    })
    .filter(item => item)[0]
}

export function findTreeItem(id, tree, resolve, idKey = 'id', childrenKey = 'children') {
  return tree.some(it => {
    if (it[idKey] === id) {
      resolve(it[childrenKey], it)
      return true
    }
    return findTreeItem(id, it[childrenKey], resolve, idKey, childrenKey)
  })
}
export function treeItemSetKey(tree, { delKey, setKey, childrenKey }) {
  childrenKey ??= 'children'
  return tree.map(it => {
    const temp = { ...it }
    temp[childrenKey] = treeItemSetKey(temp[childrenKey], { childrenKey, delKey, setKey })
    if (Array.isArray(setKey) && setKey.length) {
      temp[setKey[0]] = setKey[1]
    }
    if (typeof setKey === 'function') {
      setKey(temp)
    }
    if (delKey) delete temp[delKey]
    return temp
  })
}
