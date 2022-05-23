export class EventBus {
  constructor() {
    this.events = {}
  }

  on(event, listener) {
    if (typeof this.events[event] !== 'object') {
      this.events[event] = []
    }
    this.events[event].push(listener)
    return () => this.off(event, listener)
  }

  off(event, listener) {
    if (!listener) return delete this.events[event]
    if (typeof this.events[event] === 'object') {
      const idx = this.events[event].indexOf(listener)
      if (idx > -1) {
        this.events[event].splice(idx, 1)
      }
    }
  }

  emit(event, ...args) {
    if (typeof this.events[event] === 'object') {
      this.events[event].forEach(listener => listener.apply(this, args))
    }
  }

  once(event, listener) {
    const remove = this.on(event, (...args) => {
      remove()
      listener.apply(this, args)
    })
  }
}

export default new EventBus()