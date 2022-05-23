import { request } from '../utils/http'

export default {
  /** 获取打印模板数据源 */
  get_print_datasource(params) {
    return Promise.resolve() /* request.get('/print_datasource/query', params, {}, { loading: true }) */
  },
  /** 获取打印模板数据源类型列表*/
  get_print_datasource_types(params) {
    return Promise.resolve() /* request.get('/print_datasource/types', params, {}, { loading: true }) */
  },
  /** 获取打印方案 */
  get_print_schema(params) {
    return Promise.resolve() /* request.get('/print_schema/query', params, {}, { loading: true }) */
  },
  /** 获取打印方案详情 */
  get_print_schema_detail(id) {
    return Promise.resolve() /* request.get(`/print_schema/detail/${id}`, {}, {}, { loading: true }) */
  },
  /** 新增打印方案*/
  print_schema_save(params) {
    return Promise.resolve() /* request.post('/print_schema/save', params, {}, { loading: true }) */
  },
  /** 删除打印方案*/
  print_schema_delete(id) {
    return Promise.resolve() /* request.post(`/print_schema/delete/${id}`, {}, {}, { loading: true }) */
  },
  /** 修改打印方案*/
  print_schema_update(params) {
    return Promise.resolve() /* request.post(`/print_schema/update`, params, {}, { loading: true }) */
  },
}
