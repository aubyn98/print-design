import getLodop from './LodopFuncs'
import cloneDeep from 'lodash/cloneDeep'
import { tableTempTohtml, imageTempTohtml, htmlTempTohtml } from './tools'
import { getDate, local } from '../../../utils'
export { print, preview }

function setSystemVariables(data) {
  const user = local.getItem('userInfo', { user: {} }).user
  const systemVariables = { _system_currentDateTime: getDate(void 0, 'yyyy-MM-dd hh:mm:ss'), _system_currentLoginUserName: user.nickname, _system_currentDepartmentName: user.departmentName }
  return data.map(item => ({ ...item, ...systemVariables }))
}

/**
 * 打印功能
 * @param {*Object} temp 打印模板
 * @param {*Array} data 打印数据
 */
function print(temp, data) {
  data = setSystemVariables(data)
  let LODOP = _CreateLodop(temp.title, temp.width, temp.height, temp.paperWidth, temp.paperHeight)
  let tempItems = cloneDeep(temp.tempItems)
  let printContent = _TempParser(tempItems, data)
  if (printContent.length > 1) {
    // 打印多份
    printContent.forEach((aPrint, index) => {
      LODOP.NewPageA()
      aPrint.forEach(printItem => {
        _AddPrintItem(LODOP, printItem, index)
      })
    })
  } else {
    // 单份
    printContent[0].forEach(printItem => {
      _AddPrintItem(LODOP, printItem)
    })
  }

  let flag = LODOP.PRINT()
  return flag
}

/**
 * 打印预览功能
 * @param {*Object} temp 打印模板
 * @param {*Array} data 打印数据
 */
function preview(temp, data) {
  data = setSystemVariables(data)
  let LODOP = _CreateLodop(temp.title, temp.width, temp.height, temp.paperWidth, temp.paperHeight)
  const tempItems = cloneDeep(temp.tempItems).map(it => {
    if (it.type === 'controls-table') {
      return { ...it, columns: it.columns.filter(_ => _.visible) }
    }
    return it
  })
  let printContent = _TempParser(tempItems, data)
  if (data.length > 1) {
    // 打印多份
    printContent.forEach((aPrint, index) => {
      LODOP.NewPageA()
      aPrint.forEach(printItem => {
        _AddPrintItem(LODOP, printItem, index)
      })
    })
  } else {
    // 单份
    printContent[0].forEach(printItem => {
      _AddPrintItem(LODOP, printItem)
    })
  }

  let flag = LODOP.PREVIEW()
  return flag
}

/**
 * 模板预览功能
 * @param {*Object} temp 打印模板
 */
function previewTemp(temp) {
  let LODOP = _CreateLodop(temp.title, temp.width, temp.height, temp.paperWidth, temp.paperHeight)

  let printContent = _TempParser(temp.tempItems)
  printContent[0].forEach(printItem => {
    _AddPrintItem(LODOP, printItem)
  })
  let flag = LODOP.PREVIEW()
  return flag
}

/**
 * LODOP 根据属性创建打印
 * @param pageName 纸张名称
 * @param width 可视区域宽度(单位px)
 * @param height 可视区域高度(单位px)
 * @param paperWidth 纸张宽度(mm)
 * @param paperHeight 纸张高度(mm)
 * @param top 可视区域上边距(单位px)
 * @param left 可视区域左边距(单位px)
 */
function _CreateLodop(pageName, width, height, paperWidth = 0, paperHeight = 0, top = 0, left = 0) {
  let LODOP = getLodop()

  // console.log(strCompanyName, strLicense, strLicenseA, strLicenseB)

  // 设置软件产品注册信息
  // LODOP.SET_LICENSES(strCompanyName, strLicense, strLicenseA, strLicenseB)

  LODOP.PRINT_INITA(top, left, width, height, pageName)
  LODOP.SET_PRINT_PAGESIZE(1, paperWidth ? paperWidth + 'mm' : 0, paperHeight ? paperHeight + 'mm' : 0, '')

  return LODOP
}

/**
 * 解析模板和数据生成打印项
 * @param {*Array} tempItem 模板打赢项
 * @param {Array} data 打印数据,
 * @return {Array} 若data为null则返回处理后的模板
 */
function _TempParser(tempItem, data) {
  let temp = cloneDeep(tempItem)
  temp.sort((a, b) => a.top - b.top)
  let autoItem, LinkedItem
  // 处理位于自适应打印项下方的打印项
  temp.forEach((item, i) => {
    // 位于自适应高度项下的打印项修改top、left,并添加关联属性（style.LinkedItem）
    const cacheItem = { ...item }
    if (autoItem && item.top > autoItem.top && item.style.ItemType == 0) {
      item.top = item.top - autoItem.top - autoItem.height
      item.left = item.left - autoItem.left
      item.style.LinkedItem = LinkedItem
    }
    if (item.style.AutoHeight) {
      autoItem = cacheItem
      LinkedItem = i + 1
    }
  })

  if (data && data.length > 0) {
    // 解析打印模板和数据，生成生成打印内容
    let tempContent = []
    data.forEach(dataItem => {
      let conItem = temp.map(tempItem => {
        let item = cloneDeep(tempItem)
        if (item.name) {
          item.value = dataItem[item.name]
        }
        return item
      })
      tempContent.push(conItem)
    })
    return tempContent
  } else {
    return [temp]
  }
}

/**
 * 添加打印项
 * @param {lodop} LODOP 打印实例
 * @param {Object} printItem 打印项内容
 * @param {Number} pageIndex 当前打印页的开始序号
 */
function _AddPrintItem(LODOP, tempItem, pageIndex = 0) {
  let printItem = cloneDeep(tempItem)
  // TempItemStyle转换为LodopItemStyle
  let lodopStyle = _createLodopStyle(printItem.style)

  // 批量打印时，修改关联打印项的关联序号
  if (lodopStyle.LinkedItem == 1) {
    lodopStyle.LinkedItem = 1 + pageIndex
  }
  // 添加打印项
  switch (printItem.type) {
    case 'controls-txt':
      LODOP.ADD_PRINT_TEXT(printItem.top, printItem.left, printItem.width, printItem.height, printItem.value)
      break
    case 'controls-code':
      LODOP.ADD_PRINT_BARCODE(printItem.top, printItem.left, printItem.width, printItem.height, lodopStyle.codeType, printItem.value)
      break
    case 'controls-html':
      {
        let html = htmlTempTohtml(printItem.val, printItem.style)
        if (lodopStyle.AutoHeight) {
          LODOP.ADD_PRINT_HTM(printItem.top, printItem.left, printItem.width, 'BottomMargin:' + lodopStyle.BottomMargin + 'mm', html)
        } else {
          LODOP.ADD_PRINT_HTM(printItem.top, printItem.left, printItem.width, printItem.height, html)
        }
      }
      break
    case 'controls-table':
      {
        let html = tableTempTohtml(printItem.columns ? printItem.columns : [], printItem.value, printItem.style)
        if (lodopStyle.AutoHeight) {
          LODOP.ADD_PRINT_TABLE(printItem.top, printItem.left, printItem.width, 'BottomMargin:' + lodopStyle.BottomMargin + 'mm', html)
        } else {
          LODOP.ADD_PRINT_TABLE(printItem.top, printItem.left, printItem.width, printItem.height, html)
        }
      }
      break
    case 'controls-image':
      {
        let html = imageTempTohtml(printItem.value)
        LODOP.ADD_PRINT_IMAGE(printItem.top, printItem.left, printItem.width, printItem.height, html)
      }
      break
    case 'controls-line': {
      if (printItem.direction === 'vertical') {
        // 竖线
        LODOP.ADD_PRINT_SHAPE(1, printItem.top, printItem.left, 1, printItem.height, 0, 1, lodopStyle.Background)
        break
      }
      // 横线
      LODOP.ADD_PRINT_SHAPE(1, printItem.top, printItem.left, printItem.width, 1, 0, 1, lodopStyle.Background)
      break
    }
    default:
      ''
  }
  // 设置打印项样式
  Object.keys(lodopStyle).forEach(key => {
    LODOP.SET_PRINT_STYLEA(0, key, lodopStyle[key])
  })
  // 设置默认LodopStyle
  let defaultLodopStyle = printItem.lodopStyle
  if (defaultLodopStyle) {
    Object.keys(defaultLodopStyle).forEach(key => {
      LODOP.SET_PRINT_STYLEA(0, key, defaultLodopStyle[key])
    })
  }
}

/**
 * 将模板设计样式转换为lodop样式
 * @param style 模板样式
 * @returns lodop样式对象
 */
function _createLodopStyle(style) {
  let lodopStyle = {
    zIndex: style.zIndex,
  }

  for (let key in style) {
    if (['Bold', 'Italic', 'Underline', 'ShowBarText'].indexOf(key) > -1) {
      lodopStyle[key] = style[key] ? 1 : 0
    } else if (key === 'Alignment') {
      lodopStyle[key] = style[key] == 'left' ? 1 : style[key] == 'center' ? 2 : 3
    } else {
      lodopStyle[key] = style[key]
    }
  }

  return lodopStyle
}
