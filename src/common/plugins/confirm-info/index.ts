import { render, h, App, Component, VNode } from 'vue'
import CElDialog from './confirm-info.vue'

let confirm: Component | null = null
export function Confirm(opts: { title: string; slot?: VNode | VNode[]; message?: string; width?: string; modal?: number; contentStyle?: object; hideCancel?: boolean; cancelText?: string; hideConfirm?: boolean; ConfirmText?: string }) {
  const { slot, ...options } = opts
  return new Promise((resolve, reject) => {
    options.width ??= '420px'
    let container: HTMLElement | null = document.createElement('div')
    if (confirm) {
      render(null, container)
    }
    function close() {
      const exposed = vNode?.component?.exposed
      if (exposed) exposed.changeVisible(false)
    }
    let vNode: VNode | null = (confirm = h(
      CElDialog,
      {
        ...options,
        onConfirm: () => {
          close()
          resolve(true)
        },
        onCancel: () => {
          close()
          reject('cancel')
        },
        onClose: () => {
          reject('closed')
        },
        onClosed: () => {
          if (container) {
            render(null, container)
            container = null
            vNode = null
          }
        },
      },
      () => [slot]
    ))
    render(vNode, container)
    const first = container.firstElementChild
    first && document.body.append(first)
  })
}

export default function (app: App<any>) {
  app.config.globalProperties.$_confirm = Confirm
}
