import quoteStore, { defineStore } from '../quoteStore';
import lrz from 'lrz';
import { IndexType, numAndStr } from 'uses';
import { PxSizeDict, MMSizeDict, PageType, getTempItem } from './paper-data';
import { tempItems } from './test-data';
import { getImgFile } from 'utils';
import { ElMessage, ElLoading } from 'element-plus';
import { printApi } from 'apis';

const datasource = [
  {
    type: 'controls-txt',
    defaultValue: '{当前时间}',
    label: '当前时间',
    name: '_system_currentDateTime'
  }
];

let _cacheDragData: IndexType;
const rate = 3.7799703663793105; // 1mm = xxx像素
interface CheckPrintControl {
  visible: boolean;
  message: string;
  type: string;
  tip: string;
  file: string;
}
function getDefaultTemplate(type = '1') {
  return {
    default: 'true',
    title: '',
    type,
    width: 770,
    height: 500,
    tempItems
  };
}
const store = defineStore('print-design', {
  state: (): {
    template: IndexType;
    checkPrintControl: CheckPrintControl;
    activeItem: IndexType | null;
    datasource: IndexType[];
    previewTemplateData: IndexType;
  } => ({
    // lodop消息
    checkPrintControl: {
      visible: false,
      message: '',
      type: 'notInstalled',
      tip: '',
      file: ''
    },
    // 模板数据
    template: getDefaultTemplate(),
    // 预览数据
    previewTemplateData: {},
    // 当前激活的控件
    activeItem: null,
    datasource
  }),
  getters: {
    /** 当前激活的控件类型 */
    activeType(): {
      isCode: boolean;
      isHtml: boolean;
      isImage: boolean;
      isLine: boolean;
      isVerticalLine: boolean;
      isHorizontalLine: boolean;
      isTable: boolean;
      isTxt: boolean;
      hasFontStyle: boolean;
    } {
      const { type, direction } = this.activeItem || {};
      const isCode = type === 'controls-code',
        isHtml = type === 'controls-html',
        isImage = type === 'controls-image',
        isLine = type === 'controls-line',
        isTable = type === 'controls-table',
        isTxt = type === 'controls-txt';
      const isHorizontalLine = isLine && direction == 'horizontal';
      const isVerticalLine = isLine && direction == 'vertical';
      const hasFontStyle = isHtml || isTable || isTxt;
      return {
        isCode,
        isHtml,
        isImage,
        isLine,
        isVerticalLine,
        isHorizontalLine,
        isTable,
        isTxt,
        hasFontStyle
      };
    },
    /** 当前激活控件的索引 */
    activeIndex(state) {
      const uuid = state.activeItem?.uuid;
      return state.template.tempItems.findIndex((it: IndexType) => it.uuid === uuid);
    },
    /** 纸张大小 */
    pageRect(state) {
      const { width, height } = state.template;
      return {
        paperWidth: width ? Math.ceil(Number(width) / rate) : '',
        paperHeight: height ? Math.ceil(Number(height) / rate) : ''
      };
    },
    /** 纸张类型 */
    pageType(state) {
      const { width: w, height: h } = state.template;
      const { paperWidth, paperHeight } = this.pageRect;
      const item = Object.entries(PxSizeDict).find(([k, { width, height }]: [string, { width: number; height: number }]) => {
        const { width: mW, height: mH } = MMSizeDict[k as PageType];
        if ((w == width && h == height) || (paperWidth == Math.ceil(mW) && paperHeight == Math.ceil(mH))) {
          return k;
        }
      });
      return item ? item[0] : '';
    },
    /** 最终打印的模板 */
    finalTemplate(state): IndexType {
      return { ...state.template, ...this.pageRect };
    },
    /** 提交后台的模板 */
    postTemplate(state): IndexType {
      const { id, width, height, title, tempItems, type } = state.template;
      return {
        id,
        name: title,
        width,
        height,
        type,
        paper: this.pageType,
        ...this.pageRect,
        content: JSON.stringify(tempItems)
      };
    }
  },
  actions: {
    /** 清空数据 */
    resetData() {
      this.template = getDefaultTemplate();
    },
    /** 修改模板 */
    updateSchema() {
      return printApi.print_schema_update(this.postTemplate).then(() => {
        ElMessage.success('修改成功');
      });
    },
    /** 删除模板 */
    delSchema(id: number) {
      return printApi.print_schema_delete(id).then(() => {
        ElMessage.success('删除成功');
      });
    },
    /** 添加模板初始化 */
    addInit(type: string) {
      this.template = getDefaultTemplate(type);
    },
    /** 新增模板 */
    addSchema() {
      const { width, height, title, tempItems, type } = this.template;
      return printApi
        .print_schema_save({
          name: title,
          width,
          height,
          type,
          paper: this.pageType,
          ...this.pageRect,
          content: JSON.stringify(tempItems)
        })
        .then(res => {
          ElMessage.success('添加成功');
        });
    },
    /** 获取模板详情 */
    getSchemaDetail(id: number | string) {
      return printApi.get_print_schema_detail(id).then(res => {
        const { content, width, height, name, type, id, previewTemplateData } = {} as any;
        this.template = {
          id,
          title: name,
          type,
          width,
          height,
          tempItems: JSON.parse(content || '[]')
        };
        this.previewTemplateData = JSON.parse(previewTemplateData);
        this.getDatasource(type);
      });
    },
    /** 获取模板数据源 */
    getDatasource(type: string) {
      return printApi.get_print_datasource({ type }).then(res => {
        this.datasource = datasource;
      });
    },
    /** 拖拽数据源控件 */
    onDataSourceDragstart(e: DragEvent, data: IndexType) {
      _cacheDragData = { ...data, offsetX: e.offsetX, offsetY: e.offsetY };
    },
    onDataSourceDrop(e: DragEvent) {
      const { clientX, clientY } = e;
      const content = document.getElementById('print-design-content');
      if (!content) return;
      const { x, y } = content.getBoundingClientRect();
      const { offsetX, offsetY, ...data } = _cacheDragData;
      _cacheDragData && this.addDataSourceHandle({ ...data, left: clientX - x - offsetX, top: clientY - y - offsetY });
    },
    /** 添加数据源控件 */
    addDataSourceHandle({ type, name, label, defaultValue, children, left, top }: IndexType) {
      left ??= 20;
      top ??= 20;
      const temp = { type, name, title: label, value: defaultValue, left, top };
      if (type === 'controls-table') {
        const columns = children.map((it: IndexType) => ({ title: it.label, value: it.defaultValue, name: it.name, visible: true }));
        Object.assign(temp, { columns });
      }
      this.addTempItem(temp);
    },
    /** 删除当前激活的控件*/
    delActiveItem() {
      if (this.activeIndex > -1) {
        this.template.tempItems.splice(this.activeIndex, 1);
        this.activeItem = null;
      }
    },
    /** 修改当前激活的控件*/
    changeActiveItem(val: IndexType) {
      this.activeItem = val;
    },
    /** 修改表格列 */
    changeColsHandle(i: number, val?: IndexType | number | string, key?: string, type = 'update') {
      if (!this.activeItem) return;
      if (type === 'update') this.activeItem.columns[i][key!] = val;
    },
    /** 添加控件*/
    addTempItem(opts: IndexType) {
      if (opts.type === 'controls-image') {
        let loading: ReturnType<typeof ElLoading.service> | null = ElLoading.service({
          fullscreen: true,
          customClass: 'global-loding',
          text: '载入图片...',
          background: 'transparent'
        });
        getImgFile()
          .then(r => lrz(r[0].file))
          .then(({ base64 }) => {
            this.template.tempItems.push(getTempItem({ value: base64, ...opts }));
          })
          .catch(() => {
            ElMessage.error('加载图片失败');
          })
          .finally(() => {
            loading!.close();
            loading = null;
          });
        return;
      }
      const tempItem = getTempItem(opts);
      this.template.tempItems.push(tempItem);
      this.activeItem = tempItem;
    },
    /** 修改激活控件的属性*/
    changeTempItem(key: string, value: any) {
      const activeItem = this.activeItem;
      if (!activeItem || this.activeIndex < 0) return;
      if (key === 'direction') {
        let { width, height } = activeItem;
        const { left, top } = activeItem;
        if (value === 'horizontal') {
          width = height;
          height = 20;
        }
        if (value === 'vertical') {
          height = width;
          width = 20;
        }
        this.template.tempItems.splice(this.activeIndex, 1);
        return this.addTempItem({ type: 'controls-line', width, height, left, top, [key]: value });
      }
      activeItem[key] = ['width', 'height'].indexOf(key) > 0 ? Number(value) : value;
    },
    /** 修改激活控件的Style属性*/
    changeTempItemStyle(key: string, value: any) {
      if (!this.activeItem || this.activeIndex < 0) return;
      const activeItemStyle = this.activeItem.style;
      activeItemStyle[key] = value;
    },
    /** 修改纸张类型*/
    changePageType(pageType: PageType) {
      if (!pageType) return;
      const pxInfo = PxSizeDict[pageType];
      Object.assign(this.template, pxInfo);
    },
    /** 修改纸张大小*/
    changePageSize({ width, height }: { width?: numAndStr; height?: numAndStr }) {
      const template = this.template;
      if (width !== void 0) template.width = width ? (Number(width) * rate) >> 0 : '';
      if (height !== void 0) template.height = height ? (Number(height) * rate) >> 0 : '';
    },
    /** 来之lodop的消息*/
    showControlMessage(payload: Omit<CheckPrintControl, 'visible'>) {
      const control = this.checkPrintControl;
      control.visible = true;
      control.message = payload.message;
      control.type = payload.type;
      control.file = payload.file;
      control.tip = payload.tip || '';
    },
    /** 控制lodop消息面板的显示  */
    changeControlVisible(payload: boolean) {
      this.checkPrintControl.visible = payload;
    }
  }
});

export const printStore = store(quoteStore);

export * as paperData from './paper-data';

export * as printTestData from './test-data';

export default store;
