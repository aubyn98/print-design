import { IndexType } from 'uses/types'

type rawTypes =
  | 'Null'
  | 'Undefined'
  | 'Boolean'
  | 'String'
  | 'Number'
  | 'Symbol'
  | 'Object'
  | 'Array'
  | 'Function'
  | 'AsyncFunction'
  | 'ArrayBuffer'
  | 'Date'
  | 'Error'
  | 'Atomics'
  | 'BigInt'
  | 'BigInt64Array'
  | 'BigUint64Array'
  | 'DataView'
  | 'FinalizationRegistry'
  | 'Float32Array'
  | 'Float64Array'
  | 'Generator'
  | 'GeneratorFunction'
  | 'Int16Array'
  | 'Int32Array'
  | 'Int8Array'
  | 'Intl'
  | 'JSON'
  | 'Map'
  | 'Math'
  | 'Promise'
  | 'Reflect'
  | 'RegExp'
  | 'Set'
  | 'SharedArrayBuffer'
  | 'TypedArray'
  | 'Uint16Array'
  | 'Uint32Array'
  | 'Uint8Array'
  | 'Uint8ClampedArray'
  | 'WeakMap'
  | 'WeakRef'
  | 'WeakSet'
  | 'WebAssembly'
/**
 * 获取数据类型
 * @param val  任意数据
 */
export function getRawType(val: any): rawTypes
/**
 * 检测键
 * @param object
 * @param key  键
 */
export function hasOwnProperty(val: object, key: string): rawTypes
/**
 * 获取所有key
 */
export function getAllKeys(data: IndexType, collect: any[] = [], key: string = 'id', childrenKey: string = 'children'): IndexType
/**
 * 数据浅复制-包括 getter 和 setter
 * @param val  任意数据
 */
export function cloneWidthDescriptors<T>(val: T): T
/**
 * 数据深复制-包括 getter 和 setter
 * @param val  任意数据
 */
export function cloneDeepWidthDescriptors<T>(val: T): T

/**
 * 获取可以赋值的键
 * @param val  任意数据
 */
export function getAssignKey<T>(val: T): T

/**
 * 提取可以赋值的键值对
 * @param val  任意数据
 * @param deep 是否深层提取 默认false
 */
export function pickAssigns<T>(val: T, deep?: boolean): T

/**
 * 获取不能赋值的键
 * @param val  任意数据
 */
export function getOnlyGetterKey<T>(val: T): T

/**
 * 提取不能赋值的键值对
 * @param val  任意数据
 * @param deep 是否深层提取 默认false
 */
export function pickOnlyGetter<T>(val: T, deep?: boolean): T

/**
 * 键值对的转换赋值
 * @param target  赋值目标
 * @param origin  读取目标
 * @param keys    要转换赋值的键
 * @param opts    可选项 opts.prefix 的转换前缀; opts.direction 转换方向, 默认为left;
 */
export function tansformSetVal(target: object, origin: object, keys: string[], opts?: { prefix?: string; direction?: 'left' | 'right' }): void

/**
 * 平铺对象数组
 *  @param arr  对象数组
 *  @param key  要平铺的键
 *  @param fn   回调，参数1：迭代的每个元素
 */
export function flatWithKey<T extends Record<string, any>[]>(arr: T, key?: string, fn?: (it: T extends Array<infer U> ? U : T) => void): T

/**
 * 排除对象key
 *  @param obj  对象
 *  @param arr  排除key数组
 *  @param isFilterFalse   排除val等于false的key
 */
export function filterReqform<T extends Record<string, any>[]>(obj: object, arr: string[], isFilterFalse?: boolean): T
