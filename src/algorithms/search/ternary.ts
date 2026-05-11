import type { AlgorithmDefinition } from '../types'
import { randomArray } from '@/utils/array'

export const ternarySearch: AlgorithmDefinition = {
  meta: {
    id: 'ternary-search',
    name: '三分搜索',
    category: 'search',
    categoryLabel: '搜索',
    summary: '在有序数组中，每次将搜索区间分成三部分，排除其中两部分之一',
    complexity: { time: 'O(log₃ n)', timeBest: 'O(1)', timeWorst: 'O(log₃ n)', space: 'O(1)' },
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
      const third = Math.floor((right - left) / 3)
      const mid1 = left + third
      const mid2 = right - third

      yield { type: 'compare', targets: [mid1], description: `比较 arr[${mid1}] = ${arr[mid1]} 和目标值 ${target}` }
      if (arr[mid1] === target) {
        yield { type: 'mark', targets: [mid1], description: `找到目标值 ${target} 在索引 ${mid1}` }
        yield { type: 'done', targets: [] }
        return
      }

      yield { type: 'compare', targets: [mid2], description: `比较 arr[${mid2}] = ${arr[mid2]} 和目标值 ${target}` }
      if (arr[mid2] === target) {
        yield { type: 'mark', targets: [mid2], description: `找到目标值 ${target} 在索引 ${mid2}` }
        yield { type: 'done', targets: [] }
        return
      }

      if (target < arr[mid1]) {
        const excluded = Array.from({ length: right - mid1 + 1 }, (_, k) => mid1 + k)
        yield { type: 'exclude', targets: excluded, description: `${target} < arr[${mid1}]，排除右两部分` }
        right = mid1 - 1
      } else if (target > arr[mid2]) {
        const excluded = Array.from({ length: mid2 - left }, (_, k) => left + k)
        yield { type: 'exclude', targets: excluded, description: `${target} > arr[${mid2}]，排除左两部分` }
        left = mid2 + 1
      } else {
        const excludedLeft = Array.from({ length: mid1 - left }, (_, k) => left + k)
        const excludedRight = Array.from({ length: right - mid2 + 1 }, (_, k) => mid2 + k)
        yield { type: 'exclude', targets: [...excludedLeft, ...excludedRight], description: `arr[${mid1}] < ${target} < arr[${mid2}]，排除左右两部分` }
        left = mid1 + 1
        right = mid2 - 1
      }
    }
    yield { type: 'done', targets: [], description: `未找到目标值 ${target}` }
  },

  pseudoCode: [
    'function ternarySearch(arr, target):',
    '  left = 0, right = arr.length - 1',
    '  while left <= right:',
    '    third = (right - left) / 3',
    '    mid1 = left + third',
    '    mid2 = right - third',
    '    if arr[mid1] == target: return mid1',
    '    if arr[mid2] == target: return mid2',
    '    if target < arr[mid1]:',
    '      right = mid1 - 1',
    '    else if target > arr[mid2]:',
    '      left = mid2 + 1',
    '    else:',
    '      left = mid1 + 1',
    '      right = mid2 - 1',
    '  return -1',
  ],
}
