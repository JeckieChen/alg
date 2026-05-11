import type { AlgorithmDefinition, StepEvent } from '../types'
import { randomBST } from '@/utils/tree'
import type { TreeData } from '@/utils/tree'

export const levelOrderTraversal: AlgorithmDefinition = {
  meta: {
    id: 'level-order',
    name: 'BFS 层序遍历',
    category: 'tree',
    categoryLabel: '树结构',
    summary: '从上到下、从左到右逐层遍历节点',
    complexity: { time: 'O(n)', space: 'O(w)' },
  },
  dataShape: { kind: 'tree', nodeCount: 15 },
  visualType: 'tree',

  generateData: () => randomBST(15, 1, 99),

  generator: function* (data: TreeData): Generator<StepEvent> {
    const { nodes, rootId } = data
    if (!nodes[rootId]) {
      yield { type: 'done', targets: [], description: '空树' }
      return
    }

    const queue: number[] = [rootId]
    let level = 0

    while (queue.length > 0) {
      const levelSize = queue.length
      yield { type: 'visit', targets: [...queue], description: `第 ${level} 层, ${levelSize} 个节点` }

      for (let i = 0; i < levelSize; i++) {
        const nodeId = queue.shift()!
        const node = nodes[nodeId]
        yield { type: 'mark', targets: [nodeId], description: `访问 ${node.value}` }

        if (node.left !== null) {
          queue.push(node.left)
          yield { type: 'compare', targets: [nodeId, node.left], description: `${node.value} 的左子节点 ${nodes[node.left].value} 入队` }
        }
        if (node.right !== null) {
          queue.push(node.right)
          yield { type: 'compare', targets: [nodeId, node.right], description: `${node.value} 的右子节点 ${nodes[node.right].value} 入队` }
        }
      }
      level++
    }

    yield { type: 'done', targets: [], description: '层序遍历完成' }
  },

  pseudoCode: [
    'function levelOrder(root):',
    '  queue = [root]',
    '  while queue not empty:',
    '    node = queue.pop()',
    '    visit(node.val)',
    '    if node.left: queue.push(node.left)',
    '    if node.right: queue.push(node.right)',
  ],
}
