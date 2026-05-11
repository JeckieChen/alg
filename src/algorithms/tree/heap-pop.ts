import type { AlgorithmDefinition, StepEvent } from '../types'
import { randomArray } from '@/utils/array'

export const heapPop: AlgorithmDefinition = {
  meta: {
    id: 'heap-pop',
    name: '堆 pop',
    category: 'tree',
    categoryLabel: '树结构',
    summary: '移除堆顶元素, 将末尾元素移到堆顶, 然后通过下沉操作维护堆性质',
    complexity: { time: 'O(log n)', space: 'O(1)' },
  },
  dataShape: { kind: 'array', defaultSize: 15, min: 1, max: 99 },
  visualType: 'tree',

  generateData: () => {
    const arr = randomArray(15, 1, 99)
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
      let parent = i
      while (true) {
        const left = 2 * parent + 1
        const right = 2 * parent + 2
        let smallest = parent
        if (left < arr.length && arr[left] < arr[smallest]) smallest = left
        if (right < arr.length && arr[right] < arr[smallest]) smallest = right
        if (smallest === parent) break
        ;[arr[parent], arr[smallest]] = [arr[smallest], arr[parent]]
        parent = smallest
      }
    }
    return arr
  },

  generator: function* (data: number[]): Generator<StepEvent> {
    const arr = [...data]
    const n = arr.length
    if (n === 0) {
      yield { type: 'done', targets: [], description: '堆为空' }
      return
    }

    yield { type: 'mark', targets: [0], description: `堆顶元素 ${arr[0]} 被移除` }

    const last = arr[n - 1]
    yield { type: 'swap', targets: [0, n - 1], description: `交换堆顶和末尾元素` }
    ;[arr[0], arr[n - 1]] = [arr[n - 1], arr[0]]

    yield { type: 'exclude', targets: [n - 1], description: `末尾元素 ${last} 出堆` }

    let i = 0
    while (true) {
      const left = 2 * i + 1
      const right = 2 * i + 2
      let smallest = i

      if (left < n - 1) {
        yield { type: 'compare', targets: [i, left], description: `比较 ${arr[i]} 和左子 ${arr[left]}` }
        if (arr[left] < arr[smallest]) smallest = left
      }
      if (right < n - 1) {
        yield { type: 'compare', targets: [i, right], description: `比较 ${arr[i]} 和右子 ${arr[right]}` }
        if (arr[right] < arr[smallest]) smallest = right
      }

      if (smallest !== i) {
        yield { type: 'swap', targets: [i, smallest], description: `${arr[smallest]} 更小, 下沉交换` }
        ;[arr[i], arr[smallest]] = [arr[smallest], arr[i]]
        i = smallest
      } else {
        yield { type: 'mark', targets: [i], description: `堆性质满足, 下沉结束` }
        break
      }
    }

    yield { type: 'done', targets: [], description: '下沉完成, 堆性质恢复' }
  },

  pseudoCode: [
    'function heapPop(heap):',
    '  if heap.empty(): return null',
    '  root = heap[0]',
    '  heap[0] = heap.last()',
    '  heap.pop()',
    '  i = 0',
    '  while true:',
    '    left = 2*i + 1, right = 2*i + 2',
    '    smallest = i',
    '    if left < heap.size and heap[left] < heap[smallest]:',
    '      smallest = left',
    '    if right < heap.size and heap[right] < heap[smallest]:',
    '      smallest = right',
    '    if smallest == i: break',
    '    swap(heap[i], heap[smallest])',
    '    i = smallest',
    '  return root',
  ],
}
