import type { AlgorithmDefinition, StepEvent } from '../types'
import { randomArray } from '@/utils/array'

export const mergeSort: AlgorithmDefinition = {
  meta: {
    id: 'merge-sort',
    name: '归并排序',
    category: 'sort',
    categoryLabel: '排序',
    summary: '分治法：将数组分成两半分别排序，再合并',
    complexity: { time: 'O(n log n)', timeBest: 'O(n log n)', timeWorst: 'O(n log n)', space: 'O(n)' },
    stable: true,
    inPlace: false,
  },
  dataShape: { kind: 'array', defaultSize: 30, min: 1, max: 99 },
  visualType: 'linear',

  generateData: () => randomArray(30, 1, 99),

  generator: function* (data: number[]) {
    const arr = [...data]
    const n = arr.length
    const temp = new Array(n)

    function* merge(left: number, mid: number, right: number): Generator<StepEvent> {
      let i = left, j = mid + 1, k = left
      while (i <= mid && j <= right) {
        yield { type: 'compare', targets: [i, j], description: `比较 arr[${i}] 和 arr[${j}]` }
        if (arr[i] <= arr[j]) {
          temp[k++] = arr[i++]
        } else {
          temp[k++] = arr[j++]
        }
      }
      while (i <= mid) temp[k++] = arr[i++]
      while (j <= right) temp[k++] = arr[j++]
      for (let p = left; p <= right; p++) {
        arr[p] = temp[p]
        yield { type: 'set', targets: [p], value: temp[p], description: `arr[${p}] = ${temp[p]}` }
      }
    }

    function* sort(left: number, right: number): Generator<StepEvent> {
      if (left >= right) return
      const mid = Math.floor((left + right) / 2)
      yield { type: 'mark', targets: [left, right], description: `分治 [${left}, ${right}]` }
      yield* sort(left, mid)
      yield* sort(mid + 1, right)
      yield* merge(left, mid, right)
    }

    yield* sort(0, n - 1)
    yield { type: 'done', targets: [] }
  },

  pseudoCode: [
    'mergeSort(arr, left, right)',
    '  if left >= right return',
    '  mid = (left + right) // 2',
    '  mergeSort(arr, left, mid)',
    '  mergeSort(arr, mid+1, right)',
    '  merge(arr, left, mid, right)',
  ],
}
