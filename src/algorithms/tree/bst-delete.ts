import type { AlgorithmDefinition, StepEvent } from '../types'
import { randomBST } from '@/utils/tree'
import type { TreeData } from '@/utils/tree'

export const bstDelete: AlgorithmDefinition = {
  meta: {
    id: 'bst-delete',
    name: 'BST 删除',
    category: 'tree',
    categoryLabel: '树结构',
    summary: '在二叉搜索树中删除节点, 分三种情况处理',
    complexity: { time: 'O(h)', space: 'O(1)' },
  },
  dataShape: { kind: 'tree', nodeCount: 15 },
  visualType: 'tree',

  generateData: () => randomBST(15, 1, 99),

  generator: function* (data: TreeData, { targetValue }: { targetValue?: number } = {}): Generator<StepEvent> {
    const { nodes, rootId } = data
    const target = targetValue ?? nodes[rootId]?.value ?? 0
    let curr = rootId

    yield { type: 'visit', targets: [curr], description: `准备删除 ${target}, 从根节点开始查找` }

    while (curr !== null && curr !== undefined) {
      const node = nodes[curr]
      if (!node) break

      yield { type: 'compare', targets: [curr], description: `比较 ${node.value} 和 ${target}` }

      if (node.value === target) {
        yield { type: 'mark', targets: [curr], description: `找到目标节点 ${target}` }

        if (node.left === null && node.right === null) {
          yield { type: 'exclude', targets: [curr], description: `情况1: ${target} 是叶子节点, 直接删除` }
        } else if (node.left === null || node.right === null) {
          const child = node.left !== null ? node.left : node.right
          yield { type: 'visit', targets: [child!], description: `情况2: ${target} 只有一个子节点, 用子节点 ${nodes[child!].value} 替换` }
        } else {
          yield { type: 'compare', targets: [node.left, node.right], description: `情况3: ${target} 有两个子节点` }
          let successor = node.right
          while (nodes[successor].left !== null) {
            successor = nodes[successor].left!
            yield { type: 'visit', targets: [successor], description: `找后继节点: 左子树中最小值 ${nodes[successor].value}` }
          }
          yield { type: 'mark', targets: [successor], description: `后继节点 ${nodes[successor].value} 替换 ${target}` }
        }

        yield { type: 'done', targets: [], description: `删除 ${target} 完成` }
        return
      }

      if (target < node.value) {
        if (node.left !== null) {
          yield { type: 'visit', targets: [node.left], description: `${target} < ${node.value}, 向左子树` }
          curr = node.left
        } else {
          yield { type: 'exclude', targets: [curr], description: `${target} < ${node.value}, 左子树为空, 未找到` }
          break
        }
      } else {
        if (node.right !== null) {
          yield { type: 'visit', targets: [node.right], description: `${target} > ${node.value}, 向右子树` }
          curr = node.right
        } else {
          yield { type: 'exclude', targets: [curr], description: `${target} > ${node.value}, 右子树为空, 未找到` }
          break
        }
      }
    }

    yield { type: 'done', targets: [], description: `未找到 ${target}` }
  },

  pseudoCode: [
    'function delete(root, val):',
    '  if root == null: return null',
    '  if val < root.val: root.left = delete(root.left, val)',
    '  elif val > root.val: root.right = delete(root.right, val)',
    '  else:',
    '    if root.left == null: return root.right',
    '    if root.right == null: return root.left',
    '    successor = min(root.right)',
    '    root.val = successor.val',
    '    root.right = delete(root.right, successor.val)',
    '  return root',
  ],
}
