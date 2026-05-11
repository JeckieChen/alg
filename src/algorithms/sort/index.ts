import type { AlgorithmCategory } from '../types'
import { bubbleSort } from './bubble'
import { selectionSort } from './selection'
import { insertionSort } from './insertion'
import { shellSort } from './shell'
import { mergeSort } from './merge'
import { quickSort } from './quick'
import { heapSort } from './heap'
import { countingSort } from './counting'
import { bucketSort } from './bucket'
import { radixSort } from './radix'

export const sortAlgorithms = [
  bubbleSort,
  selectionSort,
  insertionSort,
  shellSort,
  mergeSort,
  quickSort,
  heapSort,
  countingSort,
  bucketSort,
  radixSort,
]

export const sortCategory: AlgorithmCategory = {
  id: 'sort',
  label: '排序算法',
  icon: 'bar-chart',
  description: '将一组数据按特定顺序重新排列',
  visualType: 'linear',
  algorithms: sortAlgorithms,
}
