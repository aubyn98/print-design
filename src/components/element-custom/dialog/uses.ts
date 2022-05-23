import { onBeforeUpdate, nextTick, onMounted, onBeforeUnmount, SetupContext, ExtractPropTypes } from 'vue'
export const getProps = {
  type: {
    type: String,
    default: '',
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  relativeTo: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  modal: {
    type: [Number, String],
    default: 0.1,
  },
  // 整体内容居中
  positionCenter: {
    type: Boolean,
    default: false,
  },
  cancel: {
    type: Boolean,
    default: true,
  },
  hotkey: {
    type: Boolean,
    default: false,
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  confirmText: {
    type: String,
    default: '确定',
  },
  // 背景
  background: {
    type: String,
    default: '#fff',
  },
  // 圆角
  radius: {
    type: String,
    default: '4px',
  },
  // 内容最大高度
  maxHeight: {
    type: String,
    default: '',
  },
  height: {
    type: String,
    default: '',
  },
  headerStyle: {
    type: Object,
    default: () => ({}),
  },
  contentStyle: {
    type: [Object, String],
    default: () => ({}),
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  header: {
    type: Boolean,
    default: true,
  },
  footer: {
    type: Boolean,
    default: true,
  },
  wraperStyle: {
    type: Object,
    default: () => ({}),
  },
  footerStyle: {
    type: Object,
    default: () => ({}),
  },
  headerBorder: {
    type: Boolean,
    default: true,
  },
  footerBorder: {
    type: Boolean,
    default: true,
  },
  hideCancel: {
    type: Boolean,
    default: false,
  },
  hideConfirm: {
    type: Boolean,
    default: false,
  },
  canDrag: {
    type: Boolean,
    default: true,
  },
  coordinate: {
    type: Boolean,
    default: false,
  },
}
type propsType = ExtractPropTypes<typeof getProps>
function setBodyStyle(bodyStyle: HTMLElement['style'], { top, left }: { top: number; left: number }) {
  bodyStyle.setProperty('--formDialogTop', top + 'px')
  bodyStyle.setProperty('--formDialogLeft', left + 'px')
}
export function useWatchModel(props: propsType, attrs: any) {
  function calcRelative() {
    const bodyStyle = document.body.style
    setBodyStyle(bodyStyle, { top: 0, left: 0 })
    nextTick(() => {
      if (!attrs.modelValue) return
      const relativeTo = props.relativeTo
      const parentEl = relativeTo ? document.getElementById(relativeTo) : document.body
      if (!parentEl) return
      const { top, left } = (<HTMLElement>parentEl).getBoundingClientRect()
      setBodyStyle(bodyStyle, { top, left })
    })
  }
  onMounted(calcRelative)
  onBeforeUpdate(calcRelative)
}
// 拖拽
export function useMove(props: propsType, attrs: SetupContext['attrs']): { mousedown: (e: MouseEvent) => void; closed: () => void } {
  let moveBox: HTMLElement | null | undefined,
    drag = false,
    disX = 0,
    disY = 0,
    lock: { x: number; y: number } = { x: 0, y: 0 }

  onMounted(() => {
    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('mousemove', mousemove)
    document.removeEventListener('mouseup', mouseup)
  })

  function mousemove(e: MouseEvent) {
    const container = moveBox?.parentElement
    if (!drag || !props.canDrag || !moveBox || !container || props.positionCenter) return
    // 鼠标移动坐标
    let x = e.clientX
    let y = e.clientY
    // 鼠标移动的坐标与上次坐标的差值(移动的距离) + 盒子原本的坐标
    let moveX = x - disX + moveBox.offsetLeft
    let moveY = y - disY + moveBox.offsetTop
    const maskMax = container.offsetWidth - moveBox.offsetWidth // 盒子坐标最大的水平移动距离
    const maskMax_y = container.offsetHeight - moveBox.offsetHeight // 盒子最大的垂直移动距离
    if (moveX <= 0) {
      moveX = 0
      x = lock.x // 鼠标水平坐标的最小值
    } else if (moveX >= maskMax) {
      moveX = maskMax
      x = lock.x + maskMax // 鼠标水平坐标的最大值
    }
    if (moveY <= 0) {
      moveY = 0
      y = lock.y // 鼠标垂直坐标的最小值
    } else if (moveY >= maskMax_y) {
      moveY = maskMax_y
      y = lock.y + maskMax_y // 鼠标垂直坐标的最大值
    }

    moveBox.style.marginLeft = moveX + 'px'
    moveBox.style.marginTop = moveY + 'px'
    // 记录本次移动的坐标
    disX = x
    disY = y
  }
  function mousedown(e: MouseEvent) {
    if (!props.canDrag || props.positionCenter) return
    const currentTarget = <HTMLElement>e.currentTarget
    drag = true
    // 按下鼠标时的坐标
    disX = e.clientX
    disY = e.clientY
    moveBox = currentTarget?.parentElement?.parentElement?.parentElement
    if (!moveBox) return
    // 鼠标坐标与拖拽头部盒子坐标的差值，鼠标相对于盒子的坐标
    lock = { x: e.clientX - moveBox.offsetLeft, y: e.clientY - moveBox.offsetTop }
  }
  function mouseup() {
    if (!props.canDrag) return
    drag = false
  }
  function closed() {
    drag = false
    if (moveBox) {
      moveBox.style.marginLeft = 'auto'
      moveBox.style.marginTop = <string>attrs.top
    }
  }

  return {
    mousedown,
    closed,
  }
}
