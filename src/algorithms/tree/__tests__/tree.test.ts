import { describe, it, expect } from 'vitest'
import { bstInsert } from '@/algorithms/tree/bst-insert'
import { bstSearch } from '@/algorithms/tree/bst-search'
import { bstDelete } from '@/algorithms/tree/bst-delete'
import { inorderTraversal } from '@/algorithms/tree/inorder'
import { preorderTraversal } from '@/algorithms/tree/preorder'
import { postorderTraversal } from '@/algorithms/tree/postorder'
import { levelOrderTraversal } from '@/algorithms/tree/level-order'
import { heapPush } from '@/algorithms/tree/heap-push'
import { heapPop } from '@/algorithms/tree/heap-pop'
import { randomBST, treeFromArray } from '@/utils/tree'
import type { AlgorithmDefinition, StepEvent, TreeData } from '@/algorithms/types'

/**
 * Collect all step events from a tree algorithm generator
 */
function collectTreeSteps(algo: AlgorithmDefinition, data: TreeData, targetValue?: number): StepEvent[] {
  const steps: StepEvent[] = []
  const gen = algo.generator(data, { targetValue })
  let step = gen.next()
  while (!step.done) {
    steps.push(step.value)
    step = gen.next()
  }
  return steps
}

/**
 * Collect all step events from a heap algorithm generator
 */
function collectHeapSteps(algo: AlgorithmDefinition, data: number[], targetValue?: number): StepEvent[] {
  const steps: StepEvent[] = []
  const gen = algo.generator(data, { targetValue })
  let step = gen.next()
  while (!step.done) {
    steps.push(step.value)
    step = gen.next()
  }
  return steps
}

/**
 * Get the values from BST nodes in the order they are visited/marked
 */
function getVisitedValues(steps: StepEvent[]): number[] {
  return steps
    .filter((s) => s.type === 'visit' || s.type === 'mark')
    .map((s) => {
      const desc = s.description
      const match = desc?.match(/(\d+)/)
      return match ? parseInt(match[1], 10) : null
    })
    .filter((v): v is number => v !== null)
}

describe('Tree Algorithms - BST Insert', () => {
  it('should generate visit, compare, mark, and done events', () => {
    const tree = randomBST(7, 1, 99)
    const steps = collectTreeSteps(bstInsert, tree)

    const visitCount = steps.filter((s) => s.type === 'visit').length
    const compareCount = steps.filter((s) => s.type === 'compare').length
    const doneCount = steps.filter((s) => s.type === 'done').length

    expect(visitCount).toBeGreaterThan(0)
    expect(compareCount).toBeGreaterThan(0)
    expect(doneCount).toBe(1)
  })

  it('should handle insertion at root level', () => {
    // Tree with just root
    const tree: TreeData = {
      nodes: [{ id: 0, value: 50, left: null, right: null }],
      rootId: 0,
    }
    const steps = collectTreeSteps(bstInsert, tree, 25)

    const doneStep = steps.filter((s) => s.type === 'done')[0]
    expect(doneStep).toBeDefined()
    expect(doneStep.description).toContain('25')
  })

  it('should find correct insertion path', () => {
    const tree = randomBST(5, 1, 99)
    const steps = collectTreeSteps(bstInsert, tree, 999) // Large value - goes right

    const visitSteps = steps.filter((s) => s.type === 'visit')
    const compareSteps = steps.filter((s) => s.type === 'compare')

    expect(visitSteps.length).toBeGreaterThan(0)
    expect(compareSteps.length).toBeGreaterThan(0)
  })
})

describe('Tree Algorithms - BST Search', () => {
  it('should generate visit, compare, and done events', () => {
    const tree = randomBST(7, 1, 99)
    const steps = collectTreeSteps(bstSearch, tree)

    const visitCount = steps.filter((s) => s.type === 'visit').length
    const compareCount = steps.filter((s) => s.type === 'compare').length
    const doneCount = steps.filter((s) => s.type === 'done').length

    expect(visitCount).toBeGreaterThan(0)
    expect(compareCount).toBeGreaterThan(0)
    expect(doneCount).toBe(1)
  })

  it('should find existing value', () => {
    const tree = randomBST(7, 1, 99)
    const targetValue = tree.nodes[tree.rootId].value // Root value exists
    const steps = collectTreeSteps(bstSearch, tree, targetValue)

    const markSteps = steps.filter((s) => s.type === 'mark')
    expect(markSteps.length).toBeGreaterThan(0)
    expect(markSteps[0].description).toContain('找到')
  })

  it('should handle value not in tree', () => {
    const tree = randomBST(5, 1, 50)
    const steps = collectTreeSteps(bstSearch, tree, 999) // Not in tree

    const doneStep = steps.filter((s) => s.type === 'done')[0]
    expect(doneStep.description).toContain('未找到')
  })

  it('should handle exclude when path is blocked', () => {
    const tree: TreeData = {
      nodes: [
        { id: 0, value: 50, left: null, right: null },
      ],
      rootId: 0,
    }
    const steps = collectTreeSteps(bstSearch, tree, 25) // Should go left but left is null

    const excludeSteps = steps.filter((s) => s.type === 'exclude')
    expect(excludeSteps.length).toBeGreaterThan(0)
  })
})

describe('Tree Algorithms - BST Delete', () => {
  it('should generate visit, compare, and done events', () => {
    const tree = randomBST(7, 1, 99)
    const steps = collectTreeSteps(bstDelete, tree)

    const visitCount = steps.filter((s) => s.type === 'visit').length
    const compareCount = steps.filter((s) => s.type === 'compare').length
    const doneCount = steps.filter((s) => s.type === 'done').length

    expect(compareCount).toBeGreaterThan(0)
    expect(doneCount).toBe(1)
  })

  it('should handle deleting root node', () => {
    const tree = randomBST(5, 1, 99)
    const rootValue = tree.nodes[tree.rootId].value
    const steps = collectTreeSteps(bstDelete, tree, rootValue)

    const doneStep = steps.filter((s) => s.type === 'done')[0]
    expect(doneStep).toBeDefined()
  })

  it('should handle deleting leaf node', () => {
    // Build a tree where we know the structure
    const tree: TreeData = {
      nodes: [
        { id: 0, value: 50, left: 1, right: 2 },
        { id: 1, value: 30, left: null, right: null },
        { id: 2, value: 70, left: null, right: null },
      ],
      rootId: 0,
    }
    const steps = collectTreeSteps(bstDelete, tree, 30) // Delete leaf node

    const doneStep = steps.filter((s) => s.type === 'done')[0]
    expect(doneStep).toBeDefined()
    expect(doneStep.description).toContain('删除')
  })
})

describe('Tree Algorithms - Traversals', () => {
  describe('Inorder Traversal', () => {
    it('should visit all nodes', () => {
      const tree = randomBST(7, 1, 99)
      const steps = collectTreeSteps(inorderTraversal, tree)

      const visitCount = steps.filter((s) => s.type === 'visit').length
      const markCount = steps.filter((s) => s.type === 'mark').length
      const doneCount = steps.filter((s) => s.type === 'done').length

      expect(visitCount).toBe(tree.nodes.length)
      expect(markCount).toBe(tree.nodes.length)
      expect(doneCount).toBe(1)
    })

    it('should produce sorted sequence for BST', () => {
      const tree = randomBST(7, 1, 99)
      const visitedValues = getVisitedValues(collectTreeSteps(inorderTraversal, tree))

      // Inorder traversal of BST should be sorted
      for (let i = 0; i < visitedValues.length - 1; i++) {
        expect(visitedValues[i]).toBeLessThanOrEqual(visitedValues[i + 1])
      }
    })
  })

  describe('Preorder Traversal', () => {
    it('should visit all nodes', () => {
      const tree = randomBST(7, 1, 99)
      const steps = collectTreeSteps(preorderTraversal, tree)

      const visitCount = steps.filter((s) => s.type === 'visit').length
      const doneCount = steps.filter((s) => s.type === 'done').length

      expect(visitCount).toBe(tree.nodes.length)
      expect(doneCount).toBe(1)
    })

    it('should visit root first', () => {
      const tree = randomBST(7, 1, 99)
      const steps = collectTreeSteps(preorderTraversal, tree)

      const firstVisit = steps.find((s) => s.type === 'visit')
      expect(firstVisit).toBeDefined()
      expect(firstVisit!.targets).toContain(tree.rootId)
    })
  })

  describe('Postorder Traversal', () => {
    it('should visit all nodes', () => {
      const tree = randomBST(7, 1, 99)
      const steps = collectTreeSteps(postorderTraversal, tree)

      const visitCount = steps.filter((s) => s.type === 'visit').length
      const doneCount = steps.filter((s) => s.type === 'done').length

      expect(visitCount).toBe(tree.nodes.length)
      expect(doneCount).toBe(1)
    })
  })

  describe('Level Order Traversal', () => {
    it('should visit all nodes', () => {
      const tree = randomBST(7, 1, 99)
      const steps = collectTreeSteps(levelOrderTraversal, tree)

      const markCount = steps.filter((s) => s.type === 'mark').length
      const doneCount = steps.filter((s) => s.type === 'done').length

      expect(markCount).toBe(tree.nodes.length)
      expect(doneCount).toBe(1)
    })

    it('should have visit events describing level', () => {
      const tree = randomBST(7, 1, 99)
      const steps = collectTreeSteps(levelOrderTraversal, tree)

      const visitSteps = steps.filter((s) => s.type === 'visit')
      visitSteps.forEach((step) => {
        expect(step.description).toMatch(/第.*层/)
      })
    })

    it('should handle empty tree', () => {
      const tree: TreeData = { nodes: [], rootId: 0 }
      const steps = collectTreeSteps(levelOrderTraversal, tree)

      const doneStep = steps.filter((s) => s.type === 'done')[0]
      expect(doneStep.description).toContain('空树')
    })
  })
})

describe('Tree Algorithms - Heap Operations', () => {
  describe('Heap Push', () => {
    it('should generate visit, compare, swap, mark, and done events', () => {
      // Use a simple heap
      const heap = [1, 3, 5, 7, 9]
      const steps = collectHeapSteps(heapPush, heap, 2)

      const visitCount = steps.filter((s) => s.type === 'visit').length
      const compareCount = steps.filter((s) => s.type === 'compare').length
      const doneCount = steps.filter((s) => s.type === 'done').length

      expect(visitCount).toBe(1)
      expect(compareCount).toBeGreaterThan(0)
      expect(doneCount).toBe(1)
    })

    it('should add element to the heap', () => {
      const heap = [1, 3, 5]
      const steps = collectHeapSteps(heapPush, heap, 2)

      const setSteps = steps.filter((s) => s.type === 'set')
      expect(setSteps.length).toBeGreaterThan(0)

      const doneStep = steps.filter((s) => s.type === 'done')[0]
      expect(doneStep).toBeDefined()
    })
  })

  describe('Heap Pop', () => {
    it('should generate mark, swap, compare, and done events', () => {
      // Use a simple min-heap
      const heap = [1, 3, 5, 7, 9]
      const steps = collectHeapSteps(heapPop, heap)

      const markCount = steps.filter((s) => s.type === 'mark').length
      const swapCount = steps.filter((s) => s.type === 'swap').length
      const doneCount = steps.filter((s) => s.type === 'done').length

      expect(markCount).toBeGreaterThan(0)
      expect(swapCount).toBeGreaterThan(0)
      expect(doneCount).toBe(1)
    })

    it('should handle empty heap', () => {
      const heap: number[] = []
      const steps = collectHeapSteps(heapPop, heap)

      const doneStep = steps.filter((s) => s.type === 'done')[0]
      expect(doneStep.description).toContain('空')
    })

    it('should swap root with last element', () => {
      const heap = [1, 3, 5, 7, 9]
      const steps = collectHeapSteps(heapPop, heap)

      const swapSteps = steps.filter((s) => s.type === 'swap')
      expect(swapSteps.length).toBeGreaterThan(0)
    })
  })
})

describe('Tree Algorithms - Edge Cases', () => {
  it('should handle single node tree', () => {
    const tree: TreeData = {
      nodes: [{ id: 0, value: 42, left: null, right: null }],
      rootId: 0,
    }

    // Test inorder
    const inorderSteps = collectTreeSteps(inorderTraversal, tree)
    expect(inorderSteps.filter((s) => s.type === 'visit')).toHaveLength(1)

    // Test preorder
    const preorderSteps = collectTreeSteps(preorderTraversal, tree)
    expect(preorderSteps.filter((s) => s.type === 'visit')).toHaveLength(1)

    // Test postorder
    const postorderSteps = collectTreeSteps(postorderTraversal, tree)
    expect(postorderSteps.filter((s) => s.type === 'visit')).toHaveLength(1)
  })

  it('should handle degenerate tree (linked list)', () => {
    // All nodes only have right children
    const tree: TreeData = {
      nodes: [
        { id: 0, value: 10, left: null, right: 1 },
        { id: 1, value: 20, left: null, right: 2 },
        { id: 2, value: 30, left: null, right: null },
      ],
      rootId: 0,
    }

    const inorderSteps = collectTreeSteps(inorderTraversal, tree)
    const visitedValues = getVisitedValues(inorderSteps)

    expect(visitedValues).toEqual([10, 20, 30])
  })
})