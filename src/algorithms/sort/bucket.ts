import type { AlgorithmDefinition } from '../types'
import { randomArray } from '@/utils/array'

export const bucketSort: AlgorithmDefinition = {
  meta: {
    id: 'bucket-sort',
    name: '桶排序',
    category: 'sort',
    categoryLabel: '排序',
    summary: '将数据分到若干桶中，每个桶分别排序',
    complexity: { time: 'O(n+k)', timeBest: 'O(n+k)', timeWorst: 'O(n²)', space: 'O(n+k)' },
    stable: true,
    inPlace: false,
  },
  dataShape: { kind: 'array', defaultSize: 30, min: 1, max: 99 },
  visualType: 'linear',

  generateData: () => randomArray(30, 1, 99),

  generator: function* (data: number[]) {
    const arr = [...data]
    const n = arr.length
    const bucketCount = Math.max(5, Math.floor(Math.sqrt(n)))
    const max = Math.max(...arr)
    const min = Math.min(...arr)
    const range = (max - min) / bucketCount + 1

    const buckets: number[][] = Array.from({ length: bucketCount }, () => [])

    for (let i = 0; i < n; i++) {
      const bIdx = Math.floor((arr[i] - min) / range)
      buckets[bIdx].push(arr[i])
      yield { type: 'mark', targets: [i], description: `arr[${i}] = ${arr[i]} 放入桶 ${bIdx}` }
    }

    let idx = 0
    for (let b = 0; b < bucketCount; b++) {
      buckets[b].sort((a, b) => a - b)
      yield { type: 'mark', targets: [], description: `桶 ${b} 内部排序` }
      for (let j = 0; j < buckets[b].length; j++) {
        const val = buckets[b][j]
        arr[idx] = val
        yield { type: 'set', targets: [idx], value: val, description: `arr[${idx}] = ${val} (来自桶 ${b})` }
        idx++
      }
    }
    yield { type: 'done', targets: [] }
  },

  pseudoCode: [
    'bucketCount = sqrt(n)',
    'buckets = array of empty lists',
    'for i = 0 to n-1',
    '  bIdx = (arr[i] - min) / range',
    '  buckets[bIdx].append(arr[i])',
    'idx = 0',
    'for b = 0 to bucketCount-1',
    '  sort(buckets[b])',
    '  for x in buckets[b]',
    '    arr[idx] = x',
    '    idx++',
  ],
}
