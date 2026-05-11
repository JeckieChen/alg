import type { AlgorithmDefinition } from '../types'
import { randomArray } from '@/utils/array'

export const reverseList: AlgorithmDefinition = {
  meta: {
    id: 'reverse-list',
    name: '链表反转',
    category: 'list',
    categoryLabel: '线性结构',
    summary: '遍历链表，逐个将节点的 next 指针指向前一个节点',
    complexity: { time: 'O(n)', space: 'O(1)' },
  },
  dataShape: { kind: 'array', defaultSize: 8, min: 1, max: 99 },
  visualType: 'linked-list',
  visualConfig: { dataOptions: { mode: 'single' } },

  generateData: () => randomArray(8, 1, 99),

  generator: function* (data: number[]) {
    const arr = [...data]
    const n = arr.length
    if (n === 0) {
      yield { type: 'done', targets: [] }
      return
    }

    let prev = -1
    let curr = 0

    yield { type: 'visit', targets: [curr], description: `初始化: curr 指向头节点 arr[${curr}] = ${arr[curr]}` }

    while (curr >= 0 && curr < n) {
      const next = curr + 1 < n ? curr + 1 : -1

      if (next >= 0) {
        yield { type: 'compare', targets: [curr, next], description: `记录 next = arr[${next}] = ${arr[next]}` }
      } else {
        yield { type: 'compare', targets: [curr], description: `curr 是尾节点, next = null` }
      }

      yield { type: 'mark', targets: [curr], description: `arr[${curr}].next 指向 prev (${prev >= 0 ? 'arr[' + prev + ']' : 'null'})` }

      prev = curr
      curr = next

      if (curr >= 0) {
        yield { type: 'visit', targets: [prev, curr], description: `移动指针: prev → arr[${prev}], curr → arr[${curr}]` }
      } else {
        yield { type: 'visit', targets: [prev], description: `curr 为 null, 遍历结束. prev (${prev}) 成为新头节点` }
      }
    }

    yield { type: 'done', targets: [], description: '链表反转完成' }
  },

  pseudoCode: [
    'function reverseList(head):',
    '  prev = null',
    '  curr = head',
    '  while curr != null:',
    '    next = curr.next',
    '    curr.next = prev',
    '    prev = curr',
    '    curr = next',
    '  return prev',
  ],
}
