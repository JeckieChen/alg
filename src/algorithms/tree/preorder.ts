import type { AlgorithmDefinition, StepEvent } from '../types'
import { randomBST } from '@/utils/tree'
import type { TreeData } from '@/utils/tree'

export const preorderTraversal: AlgorithmDefinition = {
  meta: {
    id: 'preorder',
    name: 'DFS 前序遍历',
    category: 'tree',
    categoryLabel: '树结构',
    summary: '根节点 → 左子树 → 右子树',
    complexity: { time: 'O(n)', space: 'O(h)' },
  },
  dataShape: { kind: 'tree', nodeCount: 15 },
  visualType: 'tree',

  generateData: () => randomBST(15, 1, 99),

  generator: function* (data: TreeData): Generator<StepEvent> {
    const { nodes, rootId } = data

    function* traverse(nodeId: number | null): Generator<StepEvent> {
      if (nodeId === null) return
      const node = nodes[nodeId]
      yield { type: 'visit', targets: [nodeId], description: `访问根节点 ${node.value}` }
      yield { type: 'mark', targets: [nodeId], description: `记录 ${node.value} (根)` }
      if (node.left !== null) {
        yield { type: 'compare', targets: [nodeId, node.left], description: `${node.value} 有左子树, 递归遍历左子树` }
        yield* traverse(node.left)
      }
      if (node.right !== null) {
        yield { type: 'compare', targets: [nodeId, node.right], description: `${node.value} 有右子树, 递归遍历右子树` }
        yield* traverse(node.right)
      }
    }

    yield* traverse(rootId)
    yield { type: 'done', targets: [], description: '前序遍历完成' }
  },

  pseudoCode: [
    'function preorder(node):',
    '  if node == null: return',
    '  visit(node.val)      // 根',
    '  preorder(node.left)  // 左',
    '  preorder(node.right) // 右',
  ],
}
