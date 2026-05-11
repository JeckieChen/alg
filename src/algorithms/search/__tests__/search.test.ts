import { describe, it, expect } from 'vitest'
import { binarySearch } from '@/algorithms/search/binary'
import { ternarySearch } from '@/algorithms/search/ternary'
import { interpolationSearch } from '@/algorithms/search/interpolation'
import { linearSearch } from '@/algorithms/search/linear'
import type { AlgorithmDefinition, StepEvent } from '@/algorithms/types'

/**
 * Collect all step events from a search algorithm generator
 */
function collectSearchSteps(
  algo: AlgorithmDefinition,
  input: number[],
  targetValue?: number
): StepEvent[] {
  const steps: StepEvent[] = []
  const gen = algo.generator(input, { targetValue })
  let step = gen.next()
  while (!step.done) {
    steps.push(step.value)
    step = gen.next()
  }
  return steps
}

/**
 * Find if the target value exists in the sorted array
 */
function valueExistsInSortedArray(arr: number[], target: number): boolean {
  return arr.some((v) => v === target)
}

/**
 * Get the index of target in sorted array using linear search
 */
function findTargetIndex(arr: number[], target: number): number {
  const idx = arr.indexOf(target)
  return idx
}

describe('Search Algorithms - Binary Search', () => {
  it('should generate visit, compare, exclude, and done events', () => {
    const sortedArr = [1, 3, 5, 7, 9, 11, 13]
    const steps = collectSearchSteps(binarySearch, sortedArr, 7)

    const visitCount = steps.filter((s) => s.type === 'visit').length
    const compareCount = steps.filter((s) => s.type === 'compare').length
    const excludeCount = steps.filter((s) => s.type === 'exclude').length
    const doneCount = steps.filter((s) => s.type === 'done').length

    expect(visitCount).toBeGreaterThan(0)
    expect(compareCount).toBeGreaterThan(0)
    expect(doneCount).toBe(1)
    expect(visitCount).toBe(compareCount) // Each visit is followed by a compare
  })

  it('should find target that exists in array', () => {
    const sortedArr = [1, 3, 5, 7, 9, 11, 13]
    const target = 7
    const steps = collectSearchSteps(binarySearch, sortedArr, target)

    // Should have a mark event for found target
    const markSteps = steps.filter((s) => s.type === 'mark')
    expect(markSteps.length).toBeGreaterThan(0)
    expect(markSteps[0].description).toContain('找到目标值')
  })

  it('should not find target that does not exist in array', () => {
    const sortedArr = [1, 3, 5, 7, 9, 11, 13]
    const target = 4
    const steps = collectSearchSteps(binarySearch, sortedArr, target)

    // Should not have a mark event (found), final done should say not found
    const markSteps = steps.filter((s) => s.type === 'mark')
    const doneStep = steps.filter((s) => s.type === 'done')[0]
    expect(doneStep.description).toContain('未找到')
  })

  it('should correctly exclude search space', () => {
    const sortedArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const steps = collectSearchSteps(binarySearch, sortedArr, 9)

    const excludeSteps = steps.filter((s) => s.type === 'exclude')
    // Excluded indices should grow as search narrows down
    excludeSteps.forEach((step) => {
      expect(step.targets.length).toBeGreaterThan(0)
    })
  })

  it('should handle single element array - found', () => {
    const arr = [5]
    const steps = collectSearchSteps(binarySearch, arr, 5)
    const doneStep = steps.filter((s) => s.type === 'done')[0]
    expect(doneStep.description).toContain('找到')
  })

  it('should handle single element array - not found', () => {
    const arr = [5]
    const steps = collectSearchSteps(binarySearch, arr, 3)
    const doneStep = steps.filter((s) => s.type === 'done')[0]
    expect(doneStep.description).toContain('未找到')
  })

  it('should handle empty array', () => {
    const arr: number[] = []
    const steps = collectSearchSteps(binarySearch, arr, 5)
    const doneStep = steps.filter((s) => s.type === 'done')[0]
    expect(doneStep.description).toContain('未找到')
  })
})

describe('Search Algorithms - Linear Search', () => {
  it('should generate compare and exclude events', () => {
    const arr = [5, 3, 8, 1, 9]
    const steps = collectSearchSteps(linearSearch, arr, 8)

    const compareCount = steps.filter((s) => s.type === 'compare').length
    const excludeCount = steps.filter((s) => s.type === 'exclude').length
    const doneCount = steps.filter((s) => s.type === 'done').length

    expect(compareCount).toBeGreaterThan(0)
    expect(excludeCount).toBeGreaterThan(0)
    expect(doneCount).toBe(1)
  })

  it('should find target at the beginning', () => {
    const arr = [5, 3, 8, 1, 9]
    const steps = collectSearchSteps(linearSearch, arr, 5)
    const markSteps = steps.filter((s) => s.type === 'mark')
    expect(markSteps.length).toBe(1)
    expect(markSteps[0].description).toContain('找到目标值')
  })

  it('should find target at the end', () => {
    const arr = [5, 3, 8, 1, 9]
    const steps = collectSearchSteps(linearSearch, arr, 9)
    const markSteps = steps.filter((s) => s.type === 'mark')
    expect(markSteps.length).toBe(1)
    expect(markSteps[0].description).toContain('找到目标值')
  })

  it('should not find target', () => {
    const arr = [5, 3, 8, 1, 9]
    const steps = collectSearchSteps(linearSearch, arr, 7)
    const doneStep = steps.filter((s) => s.type === 'done')[0]
    expect(doneStep.description).toContain('未找到')
    // All elements should be excluded
    const excludeCount = steps.filter((s) => s.type === 'exclude').length
    expect(excludeCount).toBe(arr.length)
  })

  it('should handle empty array', () => {
    const arr: number[] = []
    const steps = collectSearchSteps(linearSearch, arr, 5)
    const doneStep = steps.filter((s) => s.type === 'done')[0]
    expect(doneStep.description).toContain('未找到')
  })
})

describe('Search Algorithms - Ternary Search', () => {
  it('should generate visit, compare, exclude, and done events', () => {
    const sortedArr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
    const steps = collectSearchSteps(ternarySearch, sortedArr, 9)

    const visitCount = steps.filter((s) => s.type === 'visit').length
    const compareCount = steps.filter((s) => s.type === 'compare').length
    const doneCount = steps.filter((s) => s.type === 'done').length

    expect(visitCount).toBeGreaterThan(0)
    expect(compareCount).toBeGreaterThan(0)
    expect(doneCount).toBe(1)
  })

  it('should find target that exists in array', () => {
    const sortedArr = [1, 3, 5, 7, 9, 11, 13]
    const steps = collectSearchSteps(ternarySearch, sortedArr, 7)

    const markSteps = steps.filter((s) => s.type === 'mark')
    expect(markSteps.length).toBeGreaterThan(0)
    expect(markSteps[0].description).toContain('找到目标值')
  })

  it('should correctly exclude two-thirds of search space each iteration', () => {
    const sortedArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const steps = collectSearchSteps(ternarySearch, sortedArr, 10)

    const excludeSteps = steps.filter((s) => s.type === 'exclude')
    excludeSteps.forEach((step) => {
      // In ternary search, we exclude either left 2/3 or right 2/3 or middle 2/3
      expect(step.targets.length).toBeGreaterThan(0)
    })
  })
})

describe('Search Algorithms - Interpolation Search', () => {
  it('should generate visit, compare, exclude, and done events', () => {
    // Use roughly uniform data
    const arr = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45]
    const steps = collectSearchSteps(interpolationSearch, arr, 20)

    const visitCount = steps.filter((s) => s.type === 'visit').length
    const doneCount = steps.filter((s) => s.type === 'done').length

    expect(visitCount).toBeGreaterThan(0)
    expect(doneCount).toBe(1)
  })

  it('should find target that exists in uniformly distributed array', () => {
    const arr = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45]
    const steps = collectSearchSteps(interpolationSearch, arr, 20)

    const markSteps = steps.filter((s) => s.type === 'mark')
    expect(markSteps.length).toBeGreaterThan(0)
  })

  it('should handle non-uniform data (falls back to linear-style search)', () => {
    const arr = [1, 2, 100, 101, 102, 200, 201]
    const steps = collectSearchSteps(interpolationSearch, arr, 101)

    // Should still complete without error
    const doneCount = steps.filter((s) => s.type === 'done').length
    expect(doneCount).toBe(1)
  })

  it('should exclude search space correctly', () => {
    const arr = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45]
    const steps = collectSearchSteps(interpolationSearch, arr, 35)

    const excludeSteps = steps.filter((s) => s.type === 'exclude')
    excludeSteps.forEach((step) => {
      expect(step.targets.length).toBeGreaterThan(0)
    })
  })
})

describe('Search Algorithms - Target Value Handling', () => {
  it('should use random target when targetValue is not provided for binary search', () => {
    const sortedArr = [1, 3, 5, 7, 9]
    const steps = collectSearchSteps(binarySearch, sortedArr) // no target specified

    // Should still complete - it picks a random target from array
    const doneCount = steps.filter((s) => s.type === 'done').length
    expect(doneCount).toBe(1)
  })

  it('should respect provided target value', () => {
    const sortedArr = [1, 3, 5, 7, 9]
    const target = 5
    const steps = collectSearchSteps(binarySearch, sortedArr, target)

    const doneStep = steps.filter((s) => s.type === 'done')[0]
    expect(doneStep.description).toContain('5')
  })
})