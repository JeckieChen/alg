import type { AlgorithmDefinition } from '../types'
import { randomArray } from '@/utils/array'

export const selectionSort: AlgorithmDefinition = {
  meta: {
    id: 'selection-sort',
    name: '选择排序',
    category: 'sort',
    categoryLabel: '排序',
    summary: '每次从未排序区间选择最小元素放到已排序区间末尾',
    complexity: { time: 'O(n²)', timeBest: 'O(n²)', timeWorst: 'O(n²)', space: 'O(1)' },
    stable: false,
    inPlace: true,
  },
  dataShape: { kind: 'array', defaultSize: 30, min: 1, max: 99 },
  visualType: 'linear',

  generateData: () => randomArray(30, 1, 99),

  generator: function* (data: number[]) {
    const arr = [...data]
    const n = arr.length
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i
      yield { type: 'mark', targets: [i], description: `选择 arr[${i}] 为当前最小` }
      for (let j = i + 1; j < n; j++) {
        yield { type: 'compare', targets: [minIdx, j], description: `比较 arr[${minIdx}] 和 arr[${j}]` }
        if (arr[j] < arr[minIdx]) {
          minIdx = j
          yield { type: 'mark', targets: [minIdx], description: `更新最小值为 arr[${minIdx}]` }
        }
      }
      if (minIdx !== i) {
        ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
        yield { type: 'swap', targets: [i, minIdx], description: `交换 arr[${i}] 和 arr[${minIdx}]` }
      }
      yield { type: 'mark', targets: [i], description: `arr[${i}] 已排序` }
    }
    yield { type: 'mark', targets: [n - 1], description: '排序完成' }
    yield { type: 'done', targets: [] }
  },

  pseudoCode: [
    'for i = 0 to n-2',
    '  minIdx = i',
    '  for j = i+1 to n-1',
    '    if arr[j] < arr[minIdx]',
    '      minIdx = j',
    '  if minIdx != i: swap(arr[i], arr[minIdx])',
  ],
}
