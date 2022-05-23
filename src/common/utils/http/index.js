import axios from 'axios'
import qs from 'qs'
import { baseURL } from 'config'
import { ElLoading, ElMessage } from 'element-plus'
import { local } from 'utils'
const hasOwnProperty = Object.prototype.hasOwnProperty

// 创建实例
const http = axios.create({
  baseURL: baseURL, // 实例默认URL地址
  timeout: 2000000000, // 实例超时时间
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', // 默认请求头
  },
})
// 实例请求拦截器
http.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 实例响应拦截器
http.interceptors.response.use(
  response => {
    const {
      headers: { refresh_token },
    } = response
    if (refresh_token) {
      localStorage.setItem('x-token', refresh_token)
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

function notBoolean(val) {
  return typeof val !== 'boolean'
}
const methods = ['get', 'post', 'head', 'put', 'options', 'delete']
let loading,
  loadingCount = 0
function startLoading() {
  loadingCount++
  loading = ElLoading.service({ fullscreen: true, customClass: 'global-loding', text: '加载中', background: 'transparent' })
}
function endLoading() {
  if (loadingCount > 0) loadingCount--
  if (loadingCount === 0) {
    loading.close()
  }
}

/**
 *
 *
 * options 自定义配置
 *    token: 是否传递header值{x-token}
 *    tenant: 是否传递header值{x-tenantId}
 */
export function request(url, method, params = {}, config = {}, options = {}) {
  options = { qs: true, form: false, loading: false, params_filter: true, tenant: true, token: true, ...options }
  if (!url) throw new Error('argument[0] missing')
  if (typeof url !== 'string') throw new TypeError('argument[0] must be a string')
  if (!method) throw new Error('argument[1] missing')
  if (typeof method !== 'string') throw new TypeError('argument[1] must be a string')
  if (methods.indexOf(method) === -1) throw new TypeError('argument[1], method must be ' + methods.join(' | '))

  // 是否序列化数据
  const isQS = options.qs ?? true
  if (notBoolean(isQS)) throw new TypeError('options.qs must be a [boolean or null or undefined]')

  // 判断是否处理为表单数据
  const isForm = options.form ?? false
  if (notBoolean(isForm)) throw new TypeError('options.form must be a [boolean or null or undefined]')

  // 判断是否为post请求
  const isPost = method.toLocaleLowerCase() === 'post'

  // 处理提交的数据
  const transformRequest = [
    function (data, headers) {
      // post 请求处理数据
      if (isPost) {
        // 处理表单数据
        if (isForm) {
          Object.assign(headers, { 'Content-Type': 'multipart/form-data' }) // 设置请求头
          return Object.keys(data).reduce((form, key) => {
            form.append(key, data[key])
            return form
          }, new FormData())
        }
        // 序列化参数
        if (isQS) return qs.stringify(data)
        Object.assign(headers, { 'Content-Type': 'application/json' })
        return JSON.stringify(data)
      }

      return data
    },
  ]
  options.loading && startLoading()
  // 筛选参数
  if (typeof params === 'object' && !Array.isArray(params) && params !== null && options.params_filter) {
    params = Object.keys(params).reduce((prev, k) => {
      const val = params[k]
      if (val !== '' && val !== undefined && val !== null) prev[k] = val
      return prev
    }, {})
  }
  // 返回请求结果
  return http({
    url,
    method,
    [isPost ? 'data' : 'params']: isPost ? params : new URLSearchParams(params),
    transformRequest,
    ...config,
    options,
  })
    .then(res => {
      const data = res.data
      const hasStatus = hasOwnProperty.call(data, 'status')
      if (hasStatus && !data.status) return Promise.reject(data)
      if (!hasStatus && hasOwnProperty.call(data, 'msg')) return Promise.reject(data)
      return data
    })
    .catch(err => {
      if (hasOwnProperty.call(err, 'message')) ElMessage.error(err.message)
      if (hasOwnProperty.call(err, 'msg')) ElMessage.error(err.msg)
      return Promise.reject(err)
    })
    .finally(() => {
      options.loading && endLoading()
    })
}
function simplify(type) {
  return function (url, params, config, options) {
    return request(url, type, params, config, options)
  }
}
request.get = simplify('get')
request.post = simplify('post')
export default request
