import type { AlgorithmDefinition, StepEvent } from '../types'
import { randomArray } from '@/utils/array'

export const quickSort: AlgorithmDefinition = {
  meta: {
    id: 'quick-sort',
    name: '快速排序',
    category: 'sort',
    categoryLabel: '排序',
    summary: '分治法：选择基准，将小于基准的放左边，大于的放右边',
    complexity: { time: 'O(n log n)', timeBest: 'O(n log n)', timeWorst: 'O(n²)', space: 'O(log n)' },
    stable: false,
    inPlace: true,
  },
  dataShape: { kind: 'array', defaultSize: 30, min: 1, max: 99 },
  visualType: 'linear',

  generateData: () => randomArray(30, 1, 99),

  generator: function* (data: number[]) {
    const arr = [...data]
    const n = arr.length

    function* partition(low: number, high: number): Generator<StepEvent, number> {
      const pivot = arr[high]
      yield { type: 'mark', targets: [high], description: `选择基准 pivot = ${pivot}` }
      let i = low - 1
      for (let j = low; j < high; j++) {
        yield { type: 'compare', targets: [j, high], description: `比较 arr[${j}] 和 pivot ${pivot}` }
        if (arr[j] < pivot) {
          i++
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          yield { type: 'swap', targets: [i, j], description: `交换 arr[${i}] 和 arr[${j}]` }
        }
      }
      ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
      yield { type: 'swap', targets: [i + 1, high], description: `基准放到正确位置 ${i + 1}` }
      yield { type: 'mark', targets: [i + 1], description: `arr[${i + 1}] 已就位` }
      return i + 1
    }

    function* sort(low: number, high: number): Generator<StepEvent> {
      if (low < high) {
        yield { type: 'mark', targets: [low, high], description: `排序区间 [${low}, ${high}]` }
        const pi = yield* partition(low, high)
        yield* sort(low, pi - 1)
        yield* sort(pi + 1, high)
      }
    }

    yield* sort(0, n - 1)
    yield { type: 'done', targets: [] }
  },

  pseudoCode: [
    'quickSort(arr, low, high)',
    '  if low < high',
    '    pivot = partition(arr, low, high)',
    '    quickSort(arr, low, pivot-1)',
    '    quickSort(arr, pivot+1, high)',
    '',
    'partition(arr, low, high)',
    '  pivot = arr[high]',
    '  i = low - 1',
    '  for j = low to high-1',
    '    if arr[j] < pivot',
    '      i++',
    '      swap(arr[i], arr[j])',
    '  swap(arr[i+1], arr[high])',
    '  return i+1',
  ],
}
