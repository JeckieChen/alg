import type { AlgorithmCategory } from '../types'
import { reverseList } from './reverse-list'
import { mergeList } from './merge-list'
import { bracketMatch } from './bracket-match'
import { circularQueue } from './circular-queue'

export const listAlgorithms = [
  reverseList,
  mergeList,
  bracketMatch,
  circularQueue,
]

export const listCategory: AlgorithmCategory = {
  id: 'list',
  label: '线性结构',
  icon: 'list',
  description: '链表、栈、队列等线性数据结构操作',
  visualType: 'linear',
  algorithms: listAlgorithms,
}
