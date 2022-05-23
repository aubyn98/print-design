export type TreeType = Array<TreeRowType>
export type TreeRowType = {
  id?: string | number
  name?: string
  parentId?: string | number
  children?: Array<TreeRowType>
  [propName: string]: any
}
export type IndexType = {
  [k: string | number]: any
}
export function filterTree(tree: TreeType, id: string | number): TreeType
export function getTreeItem(tree: TreeType, key: string, val: any): TreeType
export function findTreeItem(
  id: any,
  tree: IndexType,
  resolve: (data: IndexType[]) => void,
  idKey: string = 'id',
  childrenKey: string = 'children'
): IndexType
export function treeItemSetKey(tree: IndexType, opts: { delKey?: string; setKey?: [string, any] | { (item: IndexType): void } }): IndexType[]
