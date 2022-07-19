import { IndexType } from 'uses'
import { getRandomStr } from 'utils'
import lodash from 'lodash'
export const PxSizeDict = {
  A1: {
    width: 2245,
    height: 3178,
  },
  A2: {
    width: 1587,
    height: 2245,
  },
  A3: {
    width: 1122,
    height: 1587,
  },
  A4: {
    width: 793,
    height: 1122,
  },
  A5: {
    width: 559,
    height: 793,
  },
  A6: {
    width: 396,
    height: 559,
  },
  A7: {
    width: 277,
    height: 396,
  },
  B1: {
    width: 2672,
    height: 3779,
  },
  B2: {
    width: 1889,
    height: 2672,
  },
  B3: {
    width: 1334,
    height: 1889,
  },
  B4: {
    width: 944,
    height: 1334,
  },
  B5: {
    width: 665,
    height: 944,
  },
  B6: {
    width: 472,
    height: 665,
  },
  B7: {
    width: 332,
    height: 472,
  },
  C1: {
    width: 2449,
    height: 3465,
  },
  C2: {
    width: 1731,
    height: 2449,
  },
  C3: {
    width: 1224,
    height: 1731,
  },
  C4: {
    width: 865,
    height: 1224,
  },
  C5: {
    width: 612,
    height: 865,
  },
  C6: {
    width: 430,
    height: 612,
  },
  C7: {
    width: 306,
    height: 430,
  },
}

export const MMSizeDict = {
  A1: {
    width: 593.92,
    height: 840.74,
  },
  A2: {
    width: 419.84,
    height: 593.92,
  },
  A3: {
    width: 296.83,
    height: 419.84,
  },
  A4: {
    width: 209.79,
    height: 296.83,
  },
  A5: {
    width: 147.88,
    height: 209.79,
  },
  A6: {
    width: 104.76,
    height: 147.88,
  },
  A7: {
    width: 73.28,
    height: 104.76,
  },
  B1: {
    width: 706.88,
    height: 999.74,
  },
  B2: {
    width: 499.74,
    height: 706.88,
  },
  B3: {
    width: 352.91,
    height: 499.74,
  },
  B4: {
    width: 249.74,
    height: 352.91,
  },
  B5: {
    width: 175.93,
    height: 249.74,
  },
  B6: {
    width: 124.87,
    height: 175.93,
  },
  B7: {
    width: 87.83,
    height: 124.87,
  },
  C1: {
    width: 647.88,
    height: 916.67,
  },
  C2: {
    width: 457.94,
    height: 647.88,
  },
  C3: {
    width: 323.81,
    height: 457.94,
  },
  C4: {
    width: 228.84,
    height: 323.81,
  },
  C5: {
    width: 161.9,
    height: 228.84,
  },
  C6: {
    width: 113.76,
    height: 161.9,
  },
  C7: {
    width: 80.95,
    height: 113.76,
  },
}

export type PageType = keyof typeof PxSizeDict

export const sizeList = Object.keys(PxSizeDict)

export function isHorizontalLine(val: IndexType) {
  return val.type === 'controls-line' && val.direction != 'vertical'
}

export function isVerticalLine(val: IndexType) {
  return val.type === 'controls-line' && val.direction == 'vertical'
}

export const codeTypeList = [
  '128A',
  '128B',
  '128C',
  '128Auto',
  'EAN8',
  'EAN13',
  'EAN128A',
  'EAN128B',
  'EAN128C',
  'Code39',
  '39Extended',
  '2_5interleaved',
  '2_5industrial',
  '2_5matrix',
  'UPC_A',
  'UPC_E0',
  'UPC_E1',
  'UPCsupp2',
  'UPCsupp5',
  'Code93',
  '93Extended',
  'MSI',
  'PostNet',
  'Codabar',
  // 'QRCode',
  'PDF417',
]

export const controlsType: IndexType = {
  'controls-line': '线条',
  'controls-table': '表格',
  'controls-image': '图片',
  'controls-code': '条码',
  'controls-html': 'HTML超文本',
  'controls-txt': '文本',
}

export function getTempItem(opts: IndexType) {
  if (!opts.type) throw new Error('need opts.type')
  const codeType = opts?.style?.codeType
  const dict: IndexType = {
    'controls-line': {
      type: 'controls-line',
      isEdit: true,
      dragable: true, // 是否可拖拽
      resizable: true, // 尺寸是否可变
      width: 120,
      height: 1,
      left: 20,
      top: 20,
      title: '横线',
      value: '横线',
      direction: 'horizontal',
      defaultValue: '',
      name: '',
      style: {
        zIndex: 0,
        FontSize: 9,
        Background: '#000',
        Bold: false, // 1代表粗体，0代表非粗体
        Italic: false, // 1代表斜体，0代表非斜体
        Underline: false, // 1代表有下划线，0代表无下划线
        Alignment: 'left', // 对齐方式
        ItemType: 0, // 打印类型 0--普通项 1--页眉页脚 2--页号项 3--页数项 4--多页项
      },
    },
    'controls-txt': {
      type: 'controls-txt',
      isEdit: true,
      dragable: true, // 是否可拖拽
      resizable: true, // 尺寸是否可变
      width: 130,
      height: 20,
      left: 20,
      top: 20,
      title: '自定义文本',
      value: '自定义文本',
      defaultValue: '自定义文本',
      name: '',
      style: {
        zIndex: 0,
        FontName: '微软雅黑',
        FontSize: 9,
        FontColor: '#000000',
        Bold: false, // 1代表粗体，0代表非粗体
        Italic: false, // 1代表斜体，0代表非斜体
        Underline: false, // 1代表有下划线，0代表无下划线
        Alignment: 'left', // 对齐方式
        ItemType: 0, // 打印类型 0--普通项 1--页眉页脚 2--页号项 3--页数项 4--多页项
      },
    },
    'controls-table': {
      type: 'controls-table',
      isEdit: false, // 是否可编辑
      dragable: true, // 是否可拖拽
      resizable: true, // 尺寸是否可变
      width: 240,
      height: 60,
      left: 20,
      top: 20,
      title: '表格',
      value: [],
      defaultValue: [],
      tabelHtml: '',
      columns: [], // 已选表格列表
      selectCol: [], // 已选表格列name数组（用于多选框双向绑定）
      name: '',
      style: {
        zIndex: 0,
        Alignment: 'left', // 对齐方式 1--左靠齐 2--居中 3--右靠齐
        FontName: '微软雅黑',
        FontSize: 9,
        FontColor: '#000000',
        BorderColor: '#000000',
        AutoHeight: true, // 高度自动（模板在该元素位置以下的元素都关联打印）
        BottomMargin: 0, // 距离下边距
        ItemType: 0,
      },
    },
    'controls-image': {
      type: 'controls-image',
      title: '图片',
      isEdit: false,
      dragable: true, // 是否可拖拽
      resizable: true, // 尺寸是否可变
      width: 120,
      height: 40,
      left: 20,
      top: 20,
      value: '',
      defaultValue: '',
      name: '',
      style: {
        FontSize: 9,
        zIndex: 0,
        ItemType: 0, // 打印类型 0--普通项 1--页眉页脚 2--页号项 3--页数项 4--多页项
      },
    },
    'controls-html': {
      type: 'controls-html',
      isEdit: false,
      dragable: true, // 是否可拖拽
      resizable: true, // 尺寸是否可变
      width: 120,
      height: 40,
      left: 20,
      top: 20,
      title: 'html',
      value: '<div>html<div>',
      defaultValue: '<div>html<div>',
      name: '',
      style: {
        zIndex: 0,
        ItemType: 0, // 打印类型 0--普通项 1--页眉页脚 2--页号项 3--页数项 4--多页项
        AutoHeight: false, // 高度自动（模板在该元素位置以下的元素都关联打印）
        BottomMargin: 0, // 距离下边距
      },
    },
    'controls-code': {
      type: 'controls-code',
      isEdit: false,
      dragable: true, // 是否可拖拽
      resizable: true, // 尺寸是否可变
      width: 120,
      height: codeType === 'QRCode' ? 120 : 40,
      left: 20,
      top: 20,
      title: '条码',
      value: '1234567890',
      defaultValue: '1234567890',
      name: '',
      style: {
        zIndex: 0,
        FontSize: 9,
        ShowBarText: false, // 条码是否显示值 0--不显示 1--显示
        codeType: 'Code39', // 条码类型
        ItemType: 0, // 打印类型 0--普通项 1--页眉页脚 2--页号项 3--页数项 4--多页项
      },
    },
  }
  return lodash.merge({ ...dict[opts.type], uuid: getRandomStr() }, opts)
}
