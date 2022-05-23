import type { Ref } from 'vue'
import type { ElTable, ElForm, ElTree, ElCascaderPanel } from 'element-plus'
import PVxeTable from 'comps/project/table/p-vxe-table.vue'

export type PVxeTableInstance = InstanceType<typeof PVxeTable>
export type PVxeTableType = Ref<InstanceType<typeof PVxeTable> | null | undefined>

export type ElTableInstance = InstanceType<typeof ElTable>
export type ElTableType = Ref<ElTableInstance | null | undefined>

export type ElFormInstance = InstanceType<typeof ElForm>
export type ElFormType = Ref<ElFormInstance | null | undefined>

export type ElTreeInstance = InstanceType<typeof ElTree>
export type ElTreeType = Ref<ElTreeInstance | null | undefined>

export type ElCascaderInstance = InstanceType<typeof ElCascaderPanel>
export type ElCascaderType = Ref<ElCascaderInstance | null | undefined>

export type IndexType = { [index: string | number]: any }
export type ArrayIndexType = Array<{ [index: string | number]: any }>

export type numAndStr = number | string | null | undefined

export interface AnyFn {
  (...argvs: any[]): any
}

export interface AnyPromiseFn {
  (...argvs: any[]): Promise<any>
}

export interface FormListItem {
  type?: string
  labelKey?: string
  valueKey?: string
  style?: Record<string, string | number>
  options?: Record<string, any>[]
  label: string
  prop: string
  rules?: Record<string, any>[]
}

export type FormList = FormListItem[]

export type ExtractValue<T> = {
  [P in keyof T]: T[P]
}[keyof T]

/* order */
export type OrderBottomInfoList = { label: string; prop: string | number; labelWidth?: string; width?: string; justify?: boolean }[]
/* vxe-table-menu */
export type VxeMenu = { code?: string; name: string; prefixIcon?: string; visible?: boolean; disabled?: boolean; event?: any }[]

export type OrderActionType = 'add' | 'edit' | 'lookUp'
export type OrderQuery = { id: string; actionType: OrderActionType }

export const statusDict = {
  CREATE: 'primary',
  PASS: 'success',
  NO_PASS: 'error',
} as IndexType

export const statusDict_zhCn = {
  审核中: 'primary',
  审核通过: 'success',
  审核失败: 'error',
} as IndexType

export const statusLabelDict: IndexType = {
  CREATE: '审核中',
  PASS: '审核通过',
  NO_PASS: '审核失败',
}
