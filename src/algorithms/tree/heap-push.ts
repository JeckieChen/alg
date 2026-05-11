import type { AlgorithmDefinition, StepEvent } from '../types'
import { randomArray } from '@/utils/array'

export const heapPush: AlgorithmDefinition = {
  meta: {
    id: 'heap-push',
    name: '堆 push',
    category: 'tree',
    categoryLabel: '树结构',
    summary: '向堆末尾添加元素, 然后通过上浮操作维护堆性质',
    complexity: { time: 'O(log n)', space: 'O(1)' },
  },
  dataShape: { kind: 'array', defaultSize: 15, min: 1, max: 99 },
  visualType: 'tree',

  generateData: () => {
    const arr = randomArray(14, 1, 99)
    // Build a min-heap
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

  generator: function* (data: number[], { targetValue }: { targetValue?: number } = {}): Generator<StepEvent> {
    const arr = [...data]
    const newVal = targetValue ?? Math.floor(Math.random() * 99) + 1
    let i = arr.length
    arr.push(newVal)

    yield { type: 'visit', targets: [Math.floor((i - 1) / 2)], description: `准备 push ${newVal} 到堆末尾` }
    yield { type: 'set', targets: [i], value: newVal, description: `添加 ${newVal} 到位置 ${i}` }

    while (i > 0) {
      const parent = Math.floor((i - 1) / 2)
      yield { type: 'compare', targets: [i, parent], description: `比较 ${arr[i]} 和父节点 ${arr[parent]}` }

      if (arr[i] < arr[parent]) {
        yield { type: 'swap', targets: [i, parent], description: `${arr[i]} < ${arr[parent]}, 上浮交换` }
        ;[arr[i], arr[parent]] = [arr[parent], arr[i]]
        i = parent
      } else {
        yield { type: 'mark', targets: [i], description: `${arr[i]} >= ${arr[parent]}, 堆性质满足` }
        break
      }
    }

    yield { type: 'done', targets: [], description: '上浮完成, 堆性质恢复' }
  },

  pseudoCode: [
    'function heapPush(heap, val):',
    '  heap.append(val)',
    '  i = heap.size - 1',
    '  while i > 0:',
    '    parent = (i - 1) // 2',
    '    if heap[i] < heap[parent]:',
    '      swap(heap[i], heap[parent])',
    '      i = parent',
    '    else: break',
  ],
}
