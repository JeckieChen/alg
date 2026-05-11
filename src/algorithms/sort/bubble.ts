import type { AlgorithmDefinition } from '../types'
import { randomArray } from '@/utils/array'

export const bubbleSort: AlgorithmDefinition = {
  meta: {
    id: 'bubble-sort',
    name: '冒泡排序',
    category: 'sort',
    categoryLabel: '排序',
    summary: '重复遍历数组，依次比较相邻元素并交换',
    complexity: { time: 'O(n²)', timeBest: 'O(n)', timeWorst: 'O(n²)', space: 'O(1)' },
    stable: true,
    inPlace: true,
  },
  dataShape: { kind: 'array', defaultSize: 30, min: 1, max: 99 },
  visualType: 'linear',

  generateData: () => randomArray(30, 1, 99),

  generator: function* (data: number[]) {
    const arr = [...data]
    const n = arr.length
    let earlyExit = false
    for (let i = 0; i < n - 1; i++) {
      let swapped = false
      for (let j = 0; j < n - i - 1; j++) {
        yield { type: 'compare', targets: [j, j + 1], description: `比较 arr[${j}] 和 arr[${j + 1}]` }
        if (arr[j] > arr[j + 1]) {
          const a = arr[j], b = arr[j + 1]
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          swapped = true
          yield { type: 'swap', targets: [j, j + 1], description: `交换 ${a} 和 ${b}` }
        }
      }
      yield { type: 'mark', targets: [n - i - 1], description: `arr[${n - i - 1}] 已就位` }
      if (!swapped) {
        earlyExit = true
        const remaining = Array.from({ length: n - i - 1 }, (_, k) => k)
        if (remaining.length > 0) {
          yield { type: 'mark', targets: remaining, description: '剩余元素已就位' }
        }
        break
      }
    }
    if (!earlyExit) {
      yield { type: 'mark', targets: [0], description: '排序完成' }
    }
    yield { type: 'done', targets: [] }
  },

  pseudoCode: [
    'for i = 0 to n-2',
    '  swapped = false',
    '  for j = 0 to n-i-2',
    '    if arr[j] > arr[j+1]',
    '      swap(arr[j], arr[j+1])',
    '      swapped = true',
    '  if not swapped: break',
    '  // arr[n-i-1] 已就位',
  ],
}
