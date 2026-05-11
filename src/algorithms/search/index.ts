import type { AlgorithmCategory } from '../types'
import { linearSearch } from './linear'
import { binarySearch } from './binary'
import { ternarySearch } from './ternary'
import { interpolationSearch } from './interpolation'

export const searchAlgorithms = [
  linearSearch,
  binarySearch,
  ternarySearch,
  interpolationSearch,
]

export const searchCategory: AlgorithmCategory = {
  id: 'search',
  label: '搜索算法',
  icon: 'search',
  description: '在数据集合中查找目标元素',
  visualType: 'linear',
  algorithms: searchAlgorithms,
}
