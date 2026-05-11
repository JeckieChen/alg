import type { AlgorithmDefinition, StepEvent } from '../types'
import { randomBST } from '@/utils/tree'
import type { TreeData } from '@/utils/tree'

export const postorderTraversal: AlgorithmDefinition = {
  meta: {
    id: 'postorder',
    name: 'DFS 后序遍历',
    category: 'tree',
    categoryLabel: '树结构',
    summary: '左子树 → 右子树 → 根节点',
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
      if (node.left !== null) {
        yield { type: 'compare', targets: [nodeId, node.left], description: `${node.value} 有左子树, 先遍历左子树` }
        yield* traverse(node.left)
      }
      if (node.right !== null) {
        yield { type: 'compare', targets: [nodeId, node.right], description: `${node.value} 有右子树, 再遍历右子树` }
        yield* traverse(node.right)
      }
      yield { type: 'visit', targets: [nodeId], description: `左右子树遍历完, 访问根节点 ${node.value}` }
      yield { type: 'mark', targets: [nodeId], description: `记录 ${node.value} (根)` }
    }

    yield* traverse(rootId)
    yield { type: 'done', targets: [], description: '后序遍历完成' }
  },

  pseudoCode: [
    'function postorder(node):',
    '  if node == null: return',
    '  postorder(node.left)  // 左',
    '  postorder(node.right) // 右',
    '  visit(node.val)       // 根',
  ],
}
