import type { AlgorithmDefinition, StepEvent } from '../types'
import { randomBST } from '@/utils/tree'
import type { TreeData } from '@/utils/tree'

export const bstInsert: AlgorithmDefinition = {
  meta: {
    id: 'bst-insert',
    name: 'BST 插入',
    category: 'tree',
    categoryLabel: '树结构',
    summary: '在二叉搜索树中插入新节点并维护 BST 性质',
    complexity: { time: 'O(h)', space: 'O(1)' },
  },
  dataShape: { kind: 'tree', nodeCount: 14 },
  visualType: 'tree',

  generateData: () => randomBST(14, 1, 99),

  generator: function* (data: TreeData, { targetValue }: { targetValue?: number } = {}): Generator<StepEvent> {
    const { nodes, rootId } = data
    const existingValues = new Set(nodes.map(n => n.value))
    let target = targetValue ?? 0
    while (existingValues.has(target)) {
      target = Math.floor(Math.random() * 99) + 1
    }

    let curr = rootId
    yield { type: 'visit', targets: [curr], description: `准备插入 ${target}, 从根节点开始` }

    while (true) {
      const node = nodes[curr]
      if (!node) break

      yield { type: 'compare', targets: [curr], description: `比较 ${target} 和 ${node.value}` }

      if (target < node.value) {
        if (node.left !== null) {
          yield { type: 'visit', targets: [node.left], description: `${target} < ${node.value}, 向左子树` }
          curr = node.left
        } else {
          yield { type: 'mark', targets: [curr], description: `${target} < ${node.value}, 左子树为空, 在此插入 ${target}` }
          break
        }
      } else {
        if (node.right !== null) {
          yield { type: 'visit', targets: [node.right], description: `${target} > ${node.value}, 向右子树` }
          curr = node.right
        } else {
          yield { type: 'mark', targets: [curr], description: `${target} > ${node.value}, 右子树为空, 在此插入 ${target}` }
          break
        }
      }
    }

    yield { type: 'done', targets: [], description: `插入位置确定: ${target}` }
  },

  pseudoCode: [
    'function insert(root, val):',
    '  if root == null: return new Node(val)',
    '  if val < root.val:',
    '    root.left = insert(root.left, val)',
    '  else:',
    '    root.right = insert(root.right, val)',
    '  return root',
  ],
}
