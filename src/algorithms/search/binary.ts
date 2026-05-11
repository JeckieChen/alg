import type { AlgorithmDefinition } from '../types'
import { randomArray } from '@/utils/array'

export const binarySearch: AlgorithmDefinition = {
  meta: {
    id: 'binary-search',
    name: '二分搜索',
    category: 'search',
    categoryLabel: '搜索',
    summary: '在有序数组中，每次将搜索区间缩小一半，直到找到目标值',
    complexity: { time: 'O(log n)', timeBest: 'O(1)', timeWorst: 'O(log n)', space: 'O(1)' },
  },
  dataShape: { kind: 'array', defaultSize: 30, min: 1, max: 99 },
  visualType: 'linear',

  generateData: () => {
    const arr = randomArray(30, 1, 99)
    arr.sort((a, b) => a - b)
    return arr
  },

  generator: function* (data: number[], { targetValue }: { targetValue?: number } = {}) {
    const arr = [...data].sort((a, b) => a - b)
    const target = targetValue ?? arr[Math.floor(Math.random() * arr.length)]
    let left = 0
    let right = arr.length - 1

    while (left <= right) {
      yield { type: 'visit', targets: [left, right], description: `搜索区间 [${left}, ${right}]` }
      const mid = Math.floor((left + right) / 2)
      yield { type: 'compare', targets: [mid], description: `比较 arr[${mid}] = ${arr[mid]} 和目标值 ${target}` }

      if (arr[mid] === target) {
        yield { type: 'mark', targets: [mid], description: `找到目标值 ${target} 在索引 ${mid}` }
        yield { type: 'done', targets: [] }
        return
      } else if (arr[mid] < target) {
        const excluded = Array.from({ length: mid - left + 1 }, (_, k) => left + k)
        yield { type: 'exclude', targets: excluded, description: `arr[${mid}] = ${arr[mid]} < ${target}，排除左半区间 [${left}, ${mid}]` }
        left = mid + 1
      } else {
        const excluded = Array.from({ length: right - mid + 1 }, (_, k) => mid + k)
        yield { type: 'exclude', targets: excluded, description: `arr[${mid}] = ${arr[mid]} > ${target}，排除右半区间 [${mid}, ${right}]` }
        right = mid - 1
      }
    }
    yield { type: 'done', targets: [], description: `未找到目标值 ${target}` }
  },

  pseudoCode: [
    'function binarySearch(arr, target):',
    '  left = 0, right = arr.length - 1',
    '  while left <= right:',
    '    mid = floor((left + right) / 2)',
    '    if arr[mid] == target:',
    '      return mid',
    '    if arr[mid] < target:',
    '      left = mid + 1',
    '    else:',
    '      right = mid - 1',
    '  return -1',
  ],
}
