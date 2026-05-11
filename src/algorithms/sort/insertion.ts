import type { AlgorithmDefinition } from '../types'
import { randomArray } from '@/utils/array'

export const insertionSort: AlgorithmDefinition = {
  meta: {
    id: 'insertion-sort',
    name: '插入排序',
    category: 'sort',
    categoryLabel: '排序',
    summary: '将未排序元素逐个插入到已排序区间的正确位置',
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
    yield { type: 'mark', targets: [0], description: 'arr[0] 已排序' }
    for (let i = 1; i < n; i++) {
      const key = arr[i]
      let j = i - 1
      yield { type: 'mark', targets: [i], description: `取出 arr[${i}] = ${key}` }
      while (j >= 0) {
        yield { type: 'compare', targets: [j, j + 1], description: `比较 arr[${j}] 和 ${key}` }
        if (arr[j] > key) {
          arr[j + 1] = arr[j]
          yield { type: 'set', targets: [j + 1], value: arr[j], description: `arr[${j}] 后移到位置 ${j + 1}` }
          j--
        } else {
          break
        }
      }
      arr[j + 1] = key
      yield { type: 'set', targets: [j + 1], value: key, description: `${key} 插入到位置 ${j + 1}` }
    }
    yield { type: 'done', targets: [] }
  },

  pseudoCode: [
    'for i = 1 to n-1',
    '  key = arr[i]',
    '  j = i - 1',
    '  while j >= 0 and arr[j] > key',
    '    arr[j+1] = arr[j]',
    '    j--',
    '  arr[j+1] = key',
  ],
}
