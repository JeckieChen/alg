import type { AlgorithmDefinition } from '../types'

export const interpolationSearch: AlgorithmDefinition = {
  meta: {
    id: 'interpolation-search',
    name: '插值搜索',
    category: 'search',
    categoryLabel: '搜索',
    summary: '在均匀分布的有序数组中，通过插值公式估算目标位置，优于二分搜索',
    complexity: { time: 'O(log log n)', timeBest: 'O(1)', timeWorst: 'O(n)', space: 'O(1)' },
  },
  dataShape: { kind: 'array', defaultSize: 30, min: 1, max: 99 },
  visualType: 'linear',

  generateData: () => {
    // Generate roughly uniform data for interpolation search to shine
    const arr: number[] = []
    let val = 1
    for (let i = 0; i < 30; i++) {
      val += Math.floor(Math.random() * 4) + 1
      arr.push(val)
    }
    return arr
  },

  generator: function* (data: number[], { targetValue }: { targetValue?: number } = {}) {
    const arr = [...data].sort((a, b) => a - b)
    const target = targetValue ?? arr[Math.floor(Math.random() * arr.length)]
    let left = 0
    let right = arr.length - 1

    while (left <= right && target >= arr[left] && target <= arr[right]) {
      yield { type: 'visit', targets: [left, right], description: `搜索区间 [${left}, ${right}]` }

      // Interpolation formula
      const diff = arr[right] - arr[left]
      if (diff === 0) {
        // All elements in range are equal, only possible match is at left
        if (arr[left] === target) {
          yield { type: 'mark', targets: [left], description: `找到目标值 ${target} 在索引 ${left}` }
          yield { type: 'done', targets: [] }
        } else {
          yield { type: 'done', targets: [], description: `未找到目标值 ${target}` }
        }
        return
      }
      const pos = left + Math.floor(
        ((target - arr[left]) / diff) * (right - left)
      )
      const safePos = Math.max(left, Math.min(right, pos))

      yield { type: 'compare', targets: [safePos], description: `插值估算位置 ${safePos}，arr[${safePos}] = ${arr[safePos]}` }

      if (arr[safePos] === target) {
        yield { type: 'mark', targets: [safePos], description: `找到目标值 ${target} 在索引 ${safePos}` }
        yield { type: 'done', targets: [] }
        return
      }

      if (arr[safePos] < target) {
        const excluded = Array.from({ length: safePos - left + 1 }, (_, k) => left + k)
        yield { type: 'exclude', targets: excluded, description: `arr[${safePos}] = ${arr[safePos]} < ${target}，排除左侧` }
        left = safePos + 1
      } else {
        const excluded = Array.from({ length: right - safePos + 1 }, (_, k) => safePos + k)
        yield { type: 'exclude', targets: excluded, description: `arr[${safePos}] = ${arr[safePos]} > ${target}，排除右侧` }
        right = safePos - 1
      }
    }
    yield { type: 'done', targets: [], description: `未找到目标值 ${target}` }
  },

  pseudoCode: [
    'function interpolationSearch(arr, target):',
    '  left = 0, right = arr.length - 1',
    '  while left <= right and target in [arr[left], arr[right]]:',
    '    pos = left + floor((target - arr[left]) / (arr[right] - arr[left]) * (right - left))',
    '    if arr[pos] == target: return pos',
    '    if arr[pos] < target:',
    '      left = pos + 1',
    '    else:',
    '      right = pos - 1',
    '  return -1',
  ],
}
