import type { AlgorithmDefinition, StepEvent } from '../types'
import { randomBST } from '@/utils/tree'
import type { TreeData } from '@/utils/tree'

export const bstSearch: AlgorithmDefinition = {
  meta: {
    id: 'bst-search',
    name: 'BST 搜索',
    category: 'tree',
    categoryLabel: '树结构',
    summary: '在二叉搜索树中查找目标值',
    complexity: { time: 'O(h)', timeBest: 'O(1)', timeWorst: 'O(n)', space: 'O(1)' },
  },
  dataShape: { kind: 'tree', nodeCount: 15 },
  visualType: 'tree',

  generateData: () => randomBST(15, 1, 99),

  generator: function* (data: TreeData, { targetValue }: { targetValue?: number } = {}): Generator<StepEvent> {
    const { nodes, rootId } = data
    const target = targetValue ?? nodes[rootId]?.value ?? 0
    let curr = rootId

    yield { type: 'visit', targets: [curr], description: `从根节点 ${nodes[curr]?.value} 开始搜索 ${target}` }

    while (curr !== null && curr !== undefined) {
      const node = nodes[curr]
      if (!node) break

      yield { type: 'compare', targets: [curr], description: `比较 ${node.value} 和 ${target}` }

      if (node.value === target) {
        yield { type: 'mark', targets: [curr], description: `找到目标值 ${target}!` }
        yield { type: 'done', targets: [], description: `找到 ${target}` }
        return
      }

      if (target < node.value) {
        if (node.left !== null) {
          yield { type: 'visit', targets: [node.left], description: `${target} < ${node.value}, 向左子树搜索` }
          curr = node.left
        } else {
          yield { type: 'exclude', targets: [curr], description: `${target} < ${node.value}, 但左子树为空` }
          break
        }
      } else {
        if (node.right !== null) {
          yield { type: 'visit', targets: [node.right], description: `${target} > ${node.value}, 向右子树搜索` }
          curr = node.right
        } else {
          yield { type: 'exclude', targets: [curr], description: `${target} > ${node.value}, 但右子树为空` }
          break
        }
      }
    }

    yield { type: 'done', targets: [], description: `未找到 ${target}` }
  },

  pseudoCode: [
    'function search(root, target):',
    '  curr = root',
    '  while curr != null:',
    '    if curr.val == target: return curr',
    '    if target < curr.val:',
    '      curr = curr.left',
    '    else:',
    '      curr = curr.right',
    '  return null',
  ],
}
