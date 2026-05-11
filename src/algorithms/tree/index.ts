import type { AlgorithmCategory } from '../types'
import { preorderTraversal } from './preorder'
import { inorderTraversal } from './inorder'
import { postorderTraversal } from './postorder'
import { levelOrderTraversal } from './level-order'
import { bstSearch } from './bst-search'
import { bstInsert } from './bst-insert'
import { bstDelete } from './bst-delete'
import { heapPush } from './heap-push'
import { heapPop } from './heap-pop'

export const treeAlgorithms = [
  preorderTraversal,
  inorderTraversal,
  postorderTraversal,
  levelOrderTraversal,
  bstSearch,
  bstInsert,
  bstDelete,
  heapPush,
  heapPop,
]

export const treeCategory: AlgorithmCategory = {
  id: 'tree',
  label: '树结构',
  icon: 'git-branch',
  description: '二叉树遍历、BST 操作、堆操作',
  visualType: 'tree',
  algorithms: treeAlgorithms,
}
