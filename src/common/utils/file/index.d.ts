interface Opts {
  types: Array<{
    description: string
    accept: {
      [index: string]: string[]
    }
  }>
  excludeAcceptAllOption: boolean
  multiple: boolean
}
/**
 * 获取文件DataURL
 * @param { function } file 文件 Blob | File
 */
export function readAsDataURL(file: Blob | File): Promise<string>

/**
 * 获取文件
 * @param { function } opts  可选项
 */
export function getFile(opts?: Opts): Promise<Array<Blob | File>>

/**
 * 处理图片文件列表
 */
export function imgFilesHandle(imgFiles: FileList | Array<Blob | File>): Promise<{ dataURL: string; file: Blob | File }[]>

/**
 * 获取图片文件
 * @param { function } opts  可选项
 * @param { boolean }  dataURL  默认false,开启则返回 dataURL -> base64
 */
export function getImgFile(opts?: Opts, dataURL = false): Promise<{ dataURL?: string; file: Blob | File }[]>

/**
 * 获取Excel文件
 * @param { function } opts  可选项
 */
export function getExcelFile(opts?: Opts): Promise<Array<Blob | File>>

/**
 * 获取打开文件所在文件夹
 * @param { function } filePath  文件路径
 */
export function showItemInFolder(filePath: string): Promise<any>

/**
 * 导出文件
 */
export function exportFile(opts: {
  type: 'exe' | 'excel' | 'image'
  name: string
  method: (...argvs: []) => Promise<Blob | File>
  params?: Record<string, unknown>
  saveConfig?: Record<string, unknown>
  downloadStart?: (...argvs: []) => any
  onDownloadProgress?: (opts: { loaded: number; total: number }) => any
  showInFolder?: boolean
}): Promise<[Error, string]>
