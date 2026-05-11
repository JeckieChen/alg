import type { AlgorithmCategory } from './types'
import { sortCategory } from './sort'
import { searchCategory } from './search'
import { listCategory } from './list'
import { treeCategory } from './tree'

export const categories: AlgorithmCategory[] = [
  sortCategory,
  searchCategory,
  listCategory,
  treeCategory,
]

export * from './types'
