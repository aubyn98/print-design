import { Confirm } from 'plugins/confirm-info'
export function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = e => {
      resolve(e.target.result)
    }
    fileReader.onerror = e => {
      reject(e)
    }
  })
}

export async function getFile(opts = { multiple: false }) {
  try {
    const fileList = []
    const fileHandles = await window.showOpenFilePicker(opts)
    for (let item of fileHandles) {
      const file = await item.getFile()
      fileList.push(file)
    }
    return fileList
  } catch (e) {
    return Promise.reject(e)
  }
}

export async function imgFilesHandle(imgFiles = []) {
  try {
    const imgList = []
    for (let file of imgFiles) {
      const dataURL = await readAsDataURL(file)
      imgList.push({ dataURL, file })
    }
    return imgList
  } catch (e) {
    return Promise.reject(e)
  }
}

const ImgPickerOpts = {
  types: [
    {
      description: '选择图片',
      accept: {
        'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
      },
    },
  ],
  excludeAcceptAllOption: true,
}
export async function getImgFile(opts = { multiple: false }, dataURL = false) {
  try {
    const fileList = []
    const fileHandles = await window.showOpenFilePicker({ ...ImgPickerOpts, ...opts })
    for (let item of fileHandles) {
      const file = await item.getFile()
      if (dataURL) {
        const dataURL = await readAsDataURL(file)
        fileList.push({ dataURL, file })
        continue
      }
      fileList.push({ file })
    }
    return fileList
  } catch (e) {
    return Promise.reject(e)
  }
}

const ExelPickerOpts = {
  types: [
    {
      description: '选择excel表格',
      accept: {
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      },
    },
  ],
  excludeAcceptAllOption: true,
}
export async function getExcelFile(opts = { multiple: false }) {
  try {
    const fileList = []
    const fileHandles = await window.showOpenFilePicker({ ...ExelPickerOpts, ...opts })
    for (let item of fileHandles) {
      const file = await item.getFile()
      fileList.push(file)
    }
    return fileList
  } catch (e) {
    return Promise.reject(e)
  }
}

export function showItemInFolder(filePath) {
  return ipcRenderer.invoke('showItemInFolder', filePath)
}

export async function exportFile({ type, name, method, params, saveConfig, downloadStart, onDownloadProgress, showInFolder }) {
  saveConfig ??= {}
  showInFolder ??= true
  return ipcRenderer.invoke('fileSavePath', { name, type, config: saveConfig }).then(([err, filePath]) => {
    if (err) return Promise.reject(err)
    typeof downloadStart === 'function' && downloadStart()
    if (typeof method !== 'function') return Promise.reject('method must be a function')
    return method(params, onDownloadProgress).then(res => {
      return ipcRenderer.invoke('writeFileAsArraybuffer', { data: res, filePath }).then(res => {
        if (showInFolder) Confirm({ title: '保存成功', message: '是否打开文件所在文件夹' }).then(() => showItemInFolder(filePath))
        else return res
      })
    })
  })
}
