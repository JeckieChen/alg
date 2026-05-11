import type { AlgorithmDefinition, StepEvent } from '../types'
import { randomBST } from '@/utils/tree'
import type { TreeData } from '@/utils/tree'

export const inorderTraversal: AlgorithmDefinition = {
  meta: {
    id: 'inorder',
    name: 'DFS 中序遍历',
    category: 'tree',
    categoryLabel: '树结构',
    summary: '左子树 → 根节点 → 右子树 (BST 中结果为有序序列)',
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
      yield { type: 'visit', targets: [nodeId], description: `左子树遍历完, 访问根节点 ${node.value}` }
      yield { type: 'mark', targets: [nodeId], description: `记录 ${node.value} (根)` }
      if (node.right !== null) {
        yield { type: 'compare', targets: [nodeId, node.right], description: `${node.value} 有右子树, 遍历右子树` }
        yield* traverse(node.right)
      }
    }

    yield* traverse(rootId)
    yield { type: 'done', targets: [], description: '中序遍历完成 (BST 结果有序)' }
  },

  pseudoCode: [
    'function inorder(node):',
    '  if node == null: return',
    '  inorder(node.left)   // 左',
    '  visit(node.val)      // 根',
    '  inorder(node.right)  // 右',
  ],
}
