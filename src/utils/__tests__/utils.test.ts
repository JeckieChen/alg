import { describe, it, expect } from 'vitest'
import { randomArray, shuffleArray } from '@/utils/array'
import { randomBST, treeFromArray } from '@/utils/tree'

describe('randomArray', () => {
  it('should generate array of specified size', () => {
    const arr = randomArray(10, 1, 100)
    expect(arr).toHaveLength(10)
  })

  it('should generate numbers within the specified range', () => {
    const min = 5
    const max = 15
    const arr = randomArray(100, min, max)
    arr.forEach((n) => {
      expect(n).toBeGreaterThanOrEqual(min)
      expect(n).toBeLessThanOrEqual(max)
    })
  })

  it('should handle edge case of size 0', () => {
    const arr = randomArray(0, 1, 100)
    expect(arr).toHaveLength(0)
  })

  it('should handle size 1', () => {
    const arr = randomArray(1, 1, 100)
    expect(arr).toHaveLength(1)
    expect(arr[0]).toBeGreaterThanOrEqual(1)
    expect(arr[0]).toBeLessThanOrEqual(100)
  })
})

describe('shuffleArray', () => {
  it('should return an array of the same length', () => {
    const arr = [1, 2, 3, 4, 5]
    const shuffled = shuffleArray(arr)
    expect(shuffled).toHaveLength(arr.length)
  })

  it('should contain the same elements as the original', () => {
    const arr = [1, 2, 3, 4, 5]
    const shuffled = shuffleArray(arr)
    const sortedOriginal = [...arr].sort((a, b) => a - b)
    const sortedShuffled = [...shuffled].sort((a, b) => a - b)
    expect(sortedShuffled).toEqual(sortedOriginal)
  })

  it('should not modify the original array', () => {
    const arr = [1, 2, 3, 4, 5]
    const original = [...arr]
    shuffleArray(arr)
    expect(arr).toEqual(original)
  })

  it('should handle empty array', () => {
    const arr: number[] = []
    const shuffled = shuffleArray(arr)
    expect(shuffled).toHaveLength(0)
  })

  it('should handle single element array', () => {
    const arr = [42]
    const shuffled = shuffleArray(arr)
    expect(shuffled).toEqual([42])
  })
})

describe('randomBST', () => {
  it('should generate a BST with the specified number of nodes', () => {
    const tree = randomBST(7, 1, 100)
    expect(tree.nodes).toHaveLength(7)
  })

  it('should have a valid root ID', () => {
    const tree = randomBST(7, 1, 100)
    expect(tree.rootId).toBeGreaterThanOrEqual(0)
    expect(tree.rootId).toBeLessThan(7)
  })

  it('should have valid left and right child IDs (or null)', () => {
    const tree = randomBST(15, 1, 100)
    tree.nodes.forEach((node) => {
      if (node.left !== null) {
        expect(node.left).toBeGreaterThanOrEqual(0)
        expect(node.left).toBeLessThan(tree.nodes.length)
      }
      if (node.right !== null) {
        expect(node.right).toBeGreaterThanOrEqual(0)
        expect(node.right).toBeLessThan(tree.nodes.length)
      }
    })
  })

  it('should generate values within the specified range', () => {
    const min = 10
    const max = 50
    const tree = randomBST(20, min, max)
    tree.nodes.forEach((node) => {
      expect(node.value).toBeGreaterThanOrEqual(min)
      expect(node.value).toBeLessThanOrEqual(max)
    })
  })

  it('should handle nodeCount of 1', () => {
    const tree = randomBST(1, 1, 100)
    expect(tree.nodes).toHaveLength(1)
    expect(tree.rootId).toBe(0)
    expect(tree.nodes[0].left).toBeNull()
    expect(tree.nodes[0].right).toBeNull()
  })

  it('should handle nodeCount of 0', () => {
    const tree = randomBST(0, 1, 100)
    expect(tree.nodes).toHaveLength(0)
  })
})

describe('treeFromArray', () => {
  it('should create a tree from an array', () => {
    const arr = [1, 2, 3, 4, 5]
    const tree = treeFromArray(arr)
    expect(tree.nodes).toHaveLength(5)
    expect(tree.rootId).toBe(0)
  })

  it('should correctly set parent-child relationships for binary heap representation', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7]
    const tree = treeFromArray(arr)

    // Root
    expect(tree.nodes[0].left).toBe(1)
    expect(tree.nodes[0].right).toBe(2)

    // Node at index 1
    expect(tree.nodes[1].left).toBe(3)
    expect(tree.nodes[1].right).toBe(4)

    // Node at index 2
    expect(tree.nodes[2].left).toBe(5)
    expect(tree.nodes[2].right).toBe(6)
  })

  it('should handle out-of-bounds indices correctly', () => {
    const arr = [1, 2]
    const tree = treeFromArray(arr)

    // Last node should have no children
    expect(tree.nodes[1].left).toBeNull()
    expect(tree.nodes[1].right).toBeNull()
  })

  it('should handle empty array', () => {
    const arr: number[] = []
    const tree = treeFromArray(arr)
    expect(tree.nodes).toHaveLength(0)
  })

  it('should handle single element array', () => {
    const arr = [42]
    const tree = treeFromArray(arr)
    expect(tree.nodes).toHaveLength(1)
    expect(tree.nodes[0].value).toBe(42)
    expect(tree.nodes[0].left).toBeNull()
    expect(tree.nodes[0].right).toBeNull()
  })
})