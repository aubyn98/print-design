import { render, h, App, Component } from 'vue'
import MessageInfo from './message-info.vue'

let info: Component | null = null
interface OptsType {
  message: string
  type?: 'success' | 'error' | undefined
  duration?: number
}

export function Info(opts: OptsType) {
  let container: HTMLDivElement | null = document.createElement('div')
  if (info) {
    render(null, container)
  }
  const vNode = (info = h(MessageInfo, {
    ...opts,
    onClose: () => {
      const proxy = vNode?.component?.proxy
      if (proxy) (proxy as any).visible = false
    },
    onDestroy: () => {
      if (container) {
        render(null, container)
        container = null
      }
    },
  }))
  render(vNode, container)
  const first = container.firstElementChild
  first && document.body.append(first)
}

type InfoReturnType = ReturnType<typeof Info>
type InfoFn = (options: OptsType | string) => InfoReturnType
export namespace Info {
  export let success: InfoFn
  export let error: InfoFn
}
const arrType: ['success', 'error'] = ['success', 'error']
arrType.forEach(type => {
  Info[type] = (options: OptsType | string) => {
    if (typeof options === 'string') {
      options = {
        message: options,
        type,
      }
    } else {
      options.type = type
    }
    return Info(options)
  }
})

export default function (app: App) {
  app.component('MessageInfo', MessageInfo)
  app.config.globalProperties.$info = Info
}
