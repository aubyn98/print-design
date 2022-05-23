import { Info } from 'plugins/message-info'

// 事件
export function addEventListener(target, event, fn, options) {
  target.addEventListener(event, fn, options)
  return () => target.removeEventListener(event, fn)
}
export function removeEventListener(target, event, fn) {
  target.removeEventListener(event, fn)
}

// 防抖
export function debounce(fn, delay) {
  let last = 0,
    timer = null
  let stop = () => {
    clearTimeout(timer)
  }
  function _(...argvs) {
    const now = Date.now()
    if (now - last < delay) {
      timer = setTimeout(() => {
        last = now
        fn.apply(this, argvs)
      }, delay)
    } else {
      last = now
      fn.apply(this, argvs)
    }
  }
  _.stop = stop
  return _
}

// 节流
export function throttle(func, wait = 500, immediate = true) {
  let flag
  return immediate
    ? function (...argvs) {
        if (flag) return
        flag = true
        typeof func === 'function' && func.apply(this, argvs)
        setTimeout(() => {
          flag = false
        }, wait)
      }
    : function (...argvs) {
        if (flag) return
        flag = true
        setTimeout(() => {
          flag = false
          typeof func === 'function' && func.apply(this, argvs)
        }, wait)
      }
}

// 组合函数
export function compose(...fns) {
  return fns.reduce(
    (l, r) =>
      function (...argv) {
        return r.call(
          this,
          (...opt) => {
            return l.apply(this, [...argv, ...opt])
          },
          ...argv
        )
      }
  )
}

// 复制
export function copyText(text) {
  return navigator.clipboard
    .writeText(text)
    .then(() => {
      Info.success('复制成功')
    })
    .catch(e => {
      console.log(e)
    })
}

// 日志
export function log(msg, styles = []) {
  if (!Array.isArray(styles) && typeof styles === 'object') styles = [styles]
  return console.info(
    msg,
    ...styles.map(style =>
      Object.keys(style)
        .map(k => `${k.replace(/([A-Z])/g, m => '-' + m.toLocaleLowerCase())}:${style[k]}`)
        .join(';')
    )
  )
}
log.success = function (msg) {
  log('%c' + msg, { background: 'green', color: 'white', padding: '8px', margin: '4px' })
}
log.error = function (msg) {
  log('%c' + msg, { background: 'rgb(41, 0, 0)', color: 'rgb(255, 128, 128)', padding: '8px', margin: '4px' })
}

// 定时器
const dict = {
  interval: {
    set: setInterval,
    clear: clearInterval,
  },
  timeout: {
    set: setTimeout,
    clear: clearTimeout,
  },
}

function timerFactory(key) {
  return function (...arvgs) {
    let timerId = dict[key].set.call(window || global, ...arvgs)
    function remove() {
      dict[key].clear.call(window || global, timerId)
      timerId = null
    }
    remove.timerId = timerId
    return remove
  }.softBind(null)
}
export const _setInterval = timerFactory('interval')
export const _setTimeout = timerFactory('timeout')

// 存储
function getItem(target, name, defaultVal) {
  const val = target.getItem(name)
  return val ? JSON.parse(val) : defaultVal
}
function setItem(target, name, val = '') {
  return target.setItem(name, JSON.stringify(val))
}
export const local = {
  getItem(...argv) {
    return getItem(localStorage, ...argv)
  },
  setItem(...argv) {
    return setItem(localStorage, ...argv)
  },
}
export const session = {
  getItem(...argv) {
    return getItem(sessionStorage, ...argv)
  },
  setItem(...argv) {
    return setItem(sessionStorage, ...argv)
  },
}
