import type { AlgorithmDefinition, StepEvent } from '../types'
import { randomArray } from '@/utils/array'

export const heapSort: AlgorithmDefinition = {
  meta: {
    id: 'heap-sort',
    name: '堆排序',
    category: 'sort',
    categoryLabel: '排序',
    summary: '利用堆数据结构，反复取出最大元素放到末尾',
    complexity: { time: 'O(n log n)', timeBest: 'O(n log n)', timeWorst: 'O(n log n)', space: 'O(1)' },
    stable: false,
    inPlace: true,
  },
  dataShape: { kind: 'array', defaultSize: 30, min: 1, max: 99 },
  visualType: 'linear',

  generateData: () => randomArray(30, 1, 99),

  generator: function* (data: number[]) {
    const arr = [...data]
    const n = arr.length

    function* heapify(size: number, root: number): Generator<StepEvent> {
      let largest = root
      const left = 2 * root + 1
      const right = 2 * root + 2

      if (left < size) {
        yield { type: 'compare', targets: [largest, left], description: `比较 arr[${largest}] 和 arr[${left}]` }
        if (arr[left] > arr[largest]) largest = left
      }
      if (right < size) {
        yield { type: 'compare', targets: [largest, right], description: `比较 arr[${largest}] 和 arr[${right}]` }
        if (arr[right] > arr[largest]) largest = right
      }
      if (largest !== root) {
        ;[arr[root], arr[largest]] = [arr[largest], arr[root]]
        yield { type: 'swap', targets: [root, largest], description: `交换 arr[${root}] 和 arr[${largest}]` }
        yield* heapify(size, largest)
      }
    }

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      yield { type: 'mark', targets: [i], description: `建堆：调整节点 ${i}` }
      yield* heapify(n, i)
    }

    for (let i = n - 1; i > 0; i--) {
      ;[arr[0], arr[i]] = [arr[i], arr[0]]
      yield { type: 'swap', targets: [0, i], description: `堆顶 arr[0] 放到末尾 arr[${i}]` }
      yield { type: 'mark', targets: [i], description: `arr[${i}] 已排序` }
      yield* heapify(i, 0)
    }
    yield { type: 'mark', targets: [0], description: '排序完成' }
    yield { type: 'done', targets: [] }
  },

  pseudoCode: [
    '// 建堆',
    'for i = n//2 - 1 down to 0',
    '  heapify(arr, n, i)',
    '// 排序',
    'for i = n-1 down to 1',
    '  swap(arr[0], arr[i])',
    '  heapify(arr, i, 0)',
    '',
    'heapify(arr, size, root)',
    '  largest = root',
    '  left = 2*root + 1',
    '  right = 2*root + 2',
    '  if left < size and arr[left] > arr[largest]',
    '    largest = left',
    '  if right < size and arr[right] > arr[largest]',
    '    largest = right',
    '  if largest != root',
    '    swap(arr[root], arr[largest])',
    '    heapify(arr, size, largest)',
  ],
}
