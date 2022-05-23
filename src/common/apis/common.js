import { request } from '../utils/http'

export default {
  // 下载打印控件
  get_printer_control({ file, ...params }, onDownloadProgress) {
    return request.get(
      'http://printer.installer.pnpykj.com/' + file + '.exe',
      params,
      {
        responseType: 'arraybuffer',
        onDownloadProgress,
      },
      { loading: false }
    )
  },
}
