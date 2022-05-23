import { ref, computed } from 'vue'
import { useEventListener, unrefElement } from '@vueuse/core'
export function useResizeEl() {
  let resizing = false
  let startX = 0
  const wraperRef = ref()
  const resizeRef = ref()
  const wraperWidth = ref(136)
  const resizeEl = computed(() => unrefElement(resizeRef) as HTMLElement)
  function onMousedown(e: MouseEvent) {
    e.stopPropagation()
    resizing = true
    startX = e.pageX
    document.documentElement.style.cursor = 'col-resize'
    if (resizeEl.value) resizeEl.value.style.cssText = `left:${e.pageX}px; top:32px; right:auto; border-color:#e6e6e6; position:fixed;`
  }

  useEventListener(document, 'mousemove', e => {
    if (!resizing) return
    if (resizeEl.value) {
      let left = e.pageX < 200 ? 198 : e.pageX
      if (left > 664) left = 664
      resizeEl.value.style.transform = `translateX(${left - startX}px)`
    }
  })
  useEventListener(document, 'mouseup', e => {
    if (!resizing) return
    const stepX = e.pageX - startX
    const el = unrefElement(wraperRef)
    let width = el!.getBoundingClientRect().width + stepX
    width = width > 136 ? width : 136
    width = width > 600 ? 600 : width
    wraperWidth.value = width
    el!.style.width = wraperWidth.value + 'px'
    document.documentElement.style.cursor = 'auto'
    if (resizeEl.value) resizeEl.value.style.cssText = 'transform: translateX(0); left:auto; top:0; right:-3px; border-color:#f0f0f0; position:absolute;'

    resizing = false
  })
  return {
    resizeRef,
    wraperRef,
    wraperWidth,
    onMousedown,
  }
}
