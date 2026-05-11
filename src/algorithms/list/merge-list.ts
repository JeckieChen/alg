import type { AlgorithmDefinition } from '../types'
import { randomArray } from '@/utils/array'

export const mergeList: AlgorithmDefinition = {
  meta: {
    id: 'merge-list',
    name: '合并有序链表',
    category: 'list',
    categoryLabel: '线性结构',
    summary: '双指针遍历两个有序链表，逐次取出较小节点构建新链表',
    complexity: { time: 'O(n + m)', space: 'O(1)' },
  },
  dataShape: { kind: 'array', defaultSize: 16, min: 1, max: 99 },
  visualType: 'linked-list',
  visualConfig: { dataOptions: { mode: 'dual', splitAt: 'half' } },

  generateData: () => {
    const list1 = randomArray(8, 1, 49).sort((a, b) => a - b)
    const list2 = randomArray(8, 51, 99).sort((a, b) => a - b)
    return [...list1, ...list2]
  },

  generator: function* (data: number[]) {
    const arr = [...data]
    const n = arr.length
    const mid = Math.floor(n / 2)
    const list1 = arr.slice(0, mid)
    const list2 = arr.slice(mid)

    let i = 0
    let j = 0
    const result: number[] = []

    yield { type: 'visit', targets: [0, mid], description: `初始化: p1 指向 list1 头, p2 指向 list2 头` }

    while (i < list1.length && j < list2.length) {
      yield { type: 'compare', targets: [i, mid + j], description: `比较 list1[${i}] = ${list1[i]} 和 list2[${j}] = ${list2[j]}` }

      if (list1[i] <= list2[j]) {
        result.push(list1[i])
        yield { type: 'mark', targets: [i], description: `list1[${i}] = ${list1[i]} 更小, 加入结果` }
        i++
      } else {
        result.push(list2[j])
        yield { type: 'mark', targets: [mid + j], description: `list2[${j}] = ${list2[j]} 更小, 加入结果` }
        j++
      }
    }

    while (i < list1.length) {
      yield { type: 'visit', targets: [i], description: `list1 剩余节点 list1[${i}] = ${list1[i]}, 直接加入结果` }
      result.push(list1[i])
      yield { type: 'mark', targets: [i], description: `加入结果` }
      i++
    }

    while (j < list2.length) {
      yield { type: 'visit', targets: [mid + j], description: `list2 剩余节点 list2[${j}] = ${list2[j]}, 直接加入结果` }
      result.push(list2[j])
      yield { type: 'mark', targets: [mid + j], description: `加入结果` }
      j++
    }

    yield { type: 'done', targets: [], description: `合并完成, 结果: [${result.join(', ')}]` }
  },

  pseudoCode: [
    'function mergeLists(l1, l2):',
    '  dummy = new Node(0)',
    '  tail = dummy',
    '  while l1 and l2:',
    '    if l1.val <= l2.val:',
    '      tail.next = l1',
    '      l1 = l1.next',
    '    else:',
    '      tail.next = l2',
    '      l2 = l2.next',
    '    tail = tail.next',
    '  tail.next = l1 or l2',
    '  return dummy.next',
  ],
}
