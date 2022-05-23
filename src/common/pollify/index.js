import './svg'
export default (function () {
  Function.prototype.softBind = function (obj) {
    const fn = this
    const argvs = [].slice.call(arguments, 1)
    return function () {
      return fn.apply(!this || this === (window || global) ? obj : this, argvs.concat([...arguments]))
    }
  }
  return true
})()
