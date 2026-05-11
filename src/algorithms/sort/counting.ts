import type { AlgorithmDefinition } from '../types'
import { randomArray } from '@/utils/array'

export const countingSort: AlgorithmDefinition = {
  meta: {
    id: 'counting-sort',
    name: '计数排序',
    category: 'sort',
    categoryLabel: '排序',
    summary: '统计每个值的出现次数，按计数顺序输出',
    complexity: { time: 'O(n+k)', timeBest: 'O(n+k)', timeWorst: 'O(n+k)', space: 'O(k)' },
    stable: true,
    inPlace: false,
  },
  dataShape: { kind: 'array', defaultSize: 30, min: 1, max: 50 },
  visualType: 'linear',

  generateData: () => randomArray(30, 1, 50),

  generator: function* (data: number[]) {
    const arr = [...data]
    const n = arr.length
    const max = arr.length > 0 ? Math.max(...arr) : 0
    const count = new Array(max + 1).fill(0)

    for (let i = 0; i < n; i++) {
      count[arr[i]]++
      yield { type: 'mark', targets: [i], description: `统计 arr[${i}] = ${arr[i]}` }
    }

    let idx = 0
    for (let i = 0; i <= max; i++) {
      while (count[i] > 0) {
        arr[idx] = i
        yield { type: 'set', targets: [idx], value: i, description: `arr[${idx}] = ${i}` }
        idx++
        count[i]--
      }
    }
    yield { type: 'done', targets: [] }
  },

  pseudoCode: [
    'max = max(arr)',
    'count = array of size max+1 filled with 0',
    'for i = 0 to n-1',
    '  count[arr[i]]++',
    'idx = 0',
    'for i = 0 to max',
    '  while count[i] > 0',
    '    arr[idx] = i',
    '    idx++',
    '    count[i]--',
  ],
}
