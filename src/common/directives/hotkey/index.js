import { bindEvent, unbindEvent } from './tools/main'

export const buildDirective = function (alias = {}) {
  return {
    beforeMount(el, binding) {
      bindEvent(el, binding, alias)
    },
    updated(el, binding) {
      if (binding.value !== binding.oldValue) {
        unbindEvent(el)
        bindEvent(el, binding, alias)
      }
    },
    unmounted: unbindEvent,
  }
}

export default function (app) {
  app.directive('hotkey', buildDirective())
}
