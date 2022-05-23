import lodash from 'lodash'
const toString = Object.prototype.toString
const _hasOwnProperty = Object.prototype.hasOwnProperty
const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor
const getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors
const defineProperty = Object.defineProperty
const defineProperties = Object.defineProperties

export function getRawType(val) {
  return toString.call(val).slice(8, -1)
}

export function hasOwnProperty(val, key) {
  return _hasOwnProperty.call(val, key)
}

export function cloneWidthDescriptors(val) {
  if (getRawType(val) === 'Array') return val.map(it => defineProperties({}, getOwnPropertyDescriptors(it)))
  if (getRawType(val) === 'Object') return defineProperties({}, getOwnPropertyDescriptors(val))
  return val
}

export function cloneDeepWidthDescriptors(val) {
  if (getRawType(val) === 'Array') return val.map(it => cloneDeepWidthDescriptors(it))
  if (getRawType(val) === 'Object') {
    const Descriptors = getOwnPropertyDescriptors(val)
    return Object.keys(Descriptors).reduce((_, k) => {
      if (Descriptors[k].get || Descriptors[k].set) {
        defineProperty(_, k, Descriptors[k])
      } else {
        _[k] = cloneDeepWidthDescriptors(val[k])
      }
      return _
    }, {})
  }
  return val
}

export function getAssignKey(val) {
  const Descriptors = getOwnPropertyDescriptors(val)
  return Object.keys(Descriptors).filter(k => Descriptors[k].writable || Descriptors[k].set)
}

export function pickAssigns(val, deep = false) {
  const Descriptors = getOwnPropertyDescriptors(val)
  return Object.keys(Descriptors).reduce((_, k) => {
    if (Descriptors[k].set) defineProperty(_, k, Descriptors[k])
    if (Descriptors[k].writable) {
      if (deep && getRawType(val[k]) === 'Object') {
        _[k] = pickAssigns(val[k], deep)
      } else defineProperty(_, k, Descriptors[k])
    }
    return _
  }, {})
}

export function getOnlyGetterKey(val) {
  const Descriptors = getOwnPropertyDescriptors(val)
  return Object.keys(Descriptors).filter(k => Descriptors[k].get && !Descriptors[k].set)
}

export function pickOnlyGetter(val, deep = false) {
  const Descriptors = getOwnPropertyDescriptors(val)
  return Object.keys(Descriptors).reduce((_, k) => {
    if (deep && getRawType(val[k]) === 'Object') {
      _[k] = pickOnlyGetter(val[k], deep)
    } else if (Descriptors[k].get && !Descriptors[k].set) {
      _[k] = val[k]
    }
    return _
  }, {})
}

export function getAllKeys(data, collect = [], key = 'id', childrenKey = 'children') {
  if (data) {
    data.forEach(item => {
      const children = item[childrenKey]
      if (children && children.length) {
        getAllKeys(children, collect, key)
      } else {
        collect.push(item[key])
      }
    })
  }
  return collect
}

export function flatWithKey(arr, key = 'children', fn) {
  return arr.reduce((prev, cur) => {
    const temp = prev.concat(cur, Array.isArray(cur[key]) && cur[key].length ? flatWithKey(cur[key], key, fn) : [])
    typeof fn === 'function' && fn(cur)
    return temp
  }, [])
}
export function filterReqform(val, arr, isFilterFalse = true) {
  return isFilterFalse
    ? Object.entries(lodash.omit(val, arr)).reduce((collect, [k, v]) => {
        if (v) collect[k] = v
        return collect
      }, {})
    : Object.entries(lodash.omit(val, arr))
}

export function tansformSetVal(target, origin, keys, opts = {}) {
  opts.prefix ??= ''
  opts.direction ??= 'left'
  const { prefix, direction } = opts
  keys.forEach(k => {
    const Key = prefix ? prefix + lodash.capitalize(k) : k
    if (direction === 'left') target[Key] = origin[k]
    if (direction === 'right') target[k] = origin[Key]
  })
}
