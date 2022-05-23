import { request } from '../utils/http'
export { default as commonApi } from './common'
export { default as printApi } from './print'
export default function (app) {
  app.config.globalProperties.$request = request
}
