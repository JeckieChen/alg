import type { AlgorithmDefinition } from '../types'
import { randomArray } from '@/utils/array'

export const linearSearch: AlgorithmDefinition = {
  meta: {
    id: 'linear-search',
    name: '线性搜索',
    category: 'search',
    categoryLabel: '搜索',
    summary: '逐个遍历数组元素，直到找到目标值或遍历完整个数组',
    complexity: { time: 'O(n)', timeBest: 'O(1)', timeWorst: 'O(n)', space: 'O(1)' },
  },
  dataShape: { kind: 'array', defaultSize: 30, min: 1, max: 99 },
  visualType: 'linear',

  generateData: () => randomArray(30, 1, 99),

  generator: function* (data: number[], { targetValue }: { targetValue?: number } = {}) {
    const arr = [...data]
    const target = targetValue ?? arr[Math.floor(Math.random() * arr.length)]
    const n = arr.length

    for (let i = 0; i < n; i++) {
      yield { type: 'compare', targets: [i], description: `检查 arr[${i}] = ${arr[i]}，目标值 = ${target}` }
      if (arr[i] === target) {
        yield { type: 'mark', targets: [i], description: `找到目标值 ${target} 在索引 ${i}` }
        yield { type: 'done', targets: [] }
        return
      }
      yield { type: 'exclude', targets: [i], description: `arr[${i}] = ${arr[i]} ≠ ${target}，已排除` }
    }
    yield { type: 'done', targets: [], description: `未找到目标值 ${target}` }
  },

  pseudoCode: [
    'function linearSearch(arr, target):',
    '  for i = 0 to arr.length - 1',
    '    if arr[i] == target',
    '      return i',
    '  return -1',
  ],
}
