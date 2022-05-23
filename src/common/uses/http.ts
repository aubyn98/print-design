import { ref, Ref } from 'vue'
import { ExtractValue } from './types'
interface Fn {
  (...argvs: any[]): Promise<any>
}

type Loading = {
  loading: Ref<boolean>
  changeLoading: (v: boolean) => void
}

export function useLoading<T extends Fn>(
  fn: T
): {
  getData: T
} & Loading
export function useLoading<T extends Record<string, Fn>>(fn: T): T & Loading
export function useLoading(fn: any) {
  const loading = ref(false)
  let loadingCount = 0
  const startLoading = () => {
    loadingCount++
    loading.value = true
  }
  const endLoading = () => {
    if (loadingCount > 0) loadingCount--
    if (loadingCount === 0) loading.value = false
  }
  const collect = {
    loading,
    changeLoading(v: boolean) {
      loading.value = v
    },
  } as Record<string, Fn | ExtractValue<Loading>>
  if (typeof fn === 'function') {
    collect.getData = function (...argvs: any[]) {
      startLoading()
      return fn(...argvs).finally(() => {
        endLoading()
      })
    }
  }
  if (typeof fn === 'object') {
    Object.keys(fn).forEach(k => {
      collect[k] = function (...argvs: any[]) {
        startLoading()
        return fn[k](...argvs).finally(() => {
          endLoading()
        })
      }
    })
  }
  return collect
}
