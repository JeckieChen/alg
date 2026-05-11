import type { AlgorithmDefinition } from '../types'

export const circularQueue: AlgorithmDefinition = {
  meta: {
    id: 'circular-queue',
    name: '队列 — 循环队列',
    category: 'list',
    categoryLabel: '线性结构',
    summary: '使用固定大小数组实现环形缓冲区, front/rear 指针循环移动',
    complexity: { time: 'O(1)', space: 'O(k)' },
  },
  dataShape: { kind: 'array', defaultSize: 8, min: 0, max: 0 },
  visualType: 'circular-queue',

  generateData: () => [0, 0, 0, 0, 0, 0, 0, 0],

  generator: function* (data: number[]) {
    const arr = [...data]
    const capacity = arr.length
    let front = 0
    let rear = 0
    let count = 0

    const enqueueValues = [10, 20, 30, 40, 50]
    const dequeueCount = 2
    const enqueueMore = [60, 70]

    yield { type: 'visit', targets: [], description: `初始化循环队列: 容量=${capacity}, front=0, rear=0`, extra: { front, rear, count } }

    // Enqueue phase 1
    for (const val of enqueueValues) {
      if (count >= capacity) {
        yield { type: 'compare', targets: [rear], description: `队列已满, 无法 enqueue ${val}`, extra: { front, rear, count } }
        break
      }
      yield { type: 'visit', targets: [rear], description: `rear 指向位置 ${rear}`, extra: { front, rear, count } }
      arr[rear] = val
      yield { type: 'set', targets: [rear], value: val, description: `enqueue ${val} 到位置 ${rear}`, extra: { front, rear, count } }
      rear = (rear + 1) % capacity
      count++
      yield { type: 'compare', targets: [front, (rear - 1 + capacity) % capacity], description: `front=${front}, rear=${rear}, 元素数=${count}`, extra: { front, rear, count } }
    }

    // Dequeue phase
    for (let d = 0; d < dequeueCount; d++) {
      if (count === 0) {
        yield { type: 'compare', targets: [front], description: '队列已空, 无法 dequeue', extra: { front, rear, count } }
        break
      }
      yield { type: 'visit', targets: [front], description: `dequeue 位置 ${front} 的元素 ${arr[front]}`, extra: { front, rear, count } }
      const oldVal = arr[front]
      arr[front] = 0
      yield { type: 'set', targets: [front], value: 0, description: `清空位置 ${front} (原值 ${oldVal})`, extra: { front, rear, count } }
      front = (front + 1) % capacity
      count--
      yield { type: 'compare', targets: [front, (rear - 1 + capacity) % capacity], description: `front=${front}, rear=${rear}, 元素数=${count}`, extra: { front, rear, count } }
    }

    // Enqueue phase 2 (may wrap around)
    for (const val of enqueueMore) {
      if (count >= capacity) {
        yield { type: 'compare', targets: [rear], description: `队列已满, 无法 enqueue ${val}`, extra: { front, rear, count } }
        break
      }
      yield { type: 'visit', targets: [rear], description: `rear 指向位置 ${rear} (循环)`, extra: { front, rear, count } }
      arr[rear] = val
      yield { type: 'set', targets: [rear], value: val, description: `enqueue ${val} 到位置 ${rear}`, extra: { front, rear, count } }
      rear = (rear + 1) % capacity
      count++
      yield { type: 'compare', targets: [front, (rear - 1 + capacity) % capacity], description: `front=${front}, rear=${rear}, 元素数=${count}`, extra: { front, rear, count } }
    }

    yield { type: 'done', targets: [], description: `循环队列操作完成, 最终 front=${front}, rear=${rear}, 元素数=${count}`, extra: { front, rear, count } }
  },

  pseudoCode: [
    'class CircularQueue:',
    '  constructor(k):',
    '    this.q = new Array(k).fill(0)',
    '    this.front = this.rear = 0',
    '    this.count = 0',
    '  enQueue(value):',
    '    if count == capacity: return false',
    '    q[rear] = value',
    '    rear = (rear + 1) % capacity',
    '    count++',
    '    return true',
    '  deQueue():',
    '    if count == 0: return false',
    '    front = (front + 1) % capacity',
    '    count--',
    '    return true',
  ],
}
