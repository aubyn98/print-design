export class EventBus {
  constructor()
  on(event: string, listener: (...args: Array<any>) => void): () => void
  off(event: string, listener: (...args: Array<any>) => void): void
  emit(event: string, ...args: Array<any>): void
  once(event: string, listener: (...args: Array<any>) => void): void
}
export default new EventBus()
