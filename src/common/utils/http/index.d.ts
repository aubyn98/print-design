import { AxiosRequestConfig } from 'axios'
interface indexType {
  [index: string]: any
}
type method = 'get' | 'post' | 'head' | 'put' | 'options' | 'delete'
type config = Omit<AxiosRequestConfig, 'url' | 'params' | 'data' | 'method' | 'baseURL'>
type options = { qs?: boolean; form?: boolean; loading?: boolean }
export function request(url: URL, method: method, params?: indexType, config?: config, options?: options): Promise<any>
export namespace request {
  export function get(url: URL, params?: indexType, config?: config, options?: options): Promise<any>

  export function post(url: URL, params?: indexType, config?: config, options?: options): Promise<any>
}
export default request
