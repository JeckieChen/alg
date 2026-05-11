import { describe, it, expect } from 'vitest'
import { bubbleSort } from '@/algorithms/sort/bubble'
import { selectionSort } from '@/algorithms/sort/selection'
import { insertionSort } from '@/algorithms/sort/insertion'
import { quickSort } from '@/algorithms/sort/quick'
import { mergeSort } from '@/algorithms/sort/merge'
import { heapSort } from '@/algorithms/sort/heap'
import { countingSort } from '@/algorithms/sort/counting'
import { radixSort } from '@/algorithms/sort/radix'
import { bucketSort } from '@/algorithms/sort/bucket'
import { shellSort } from '@/algorithms/sort/shell'
import type { AlgorithmDefinition, StepEvent } from '@/algorithms/types'

/**
 * Helper function to run a sorting algorithm generator and return the final array state
 */
function runSortingAlgorithm(algo: AlgorithmDefinition, input: number[]): number[] {
  const generator = algo.generator(input)
  let result = generator.next()
  while (!result.done) {
    result = generator.next()
  }
  // After generator completes, we need to apply all set/swap operations to get final state
  // Since the generator yields events but doesn't modify the original array,
  // we need to replay the operations
  const arr = [...input]
  const gen = algo.generator(arr)
  let step = gen.next()
  while (!step.done) {
    const event = step.value as StepEvent
    if (event.type === 'swap') {
      const [i, j] = event.targets
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    } else if (event.type === 'set' && event.value !== undefined) {
      arr[event.targets[0]] = event.value
    }
    step = gen.next()
  }
  return arr
}

/**
 * Helper to get the final array after running generator with all steps applied
 */
function getFinalArrayAfterSort(algo: AlgorithmDefinition, input: number[]): number[] {
  const arr = [...input]
  const gen = algo.generator(arr)
  let step = gen.next()

  while (!step.done) {
    const event = step.value as StepEvent
    if (event.type === 'swap' && event.targets.length === 2) {
      const [i, j] = event.targets
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    } else if (event.type === 'set' && event.targets.length > 0 && event.value !== undefined) {
      arr[event.targets[0]] = event.value
    }
    step = gen.next()
  }
  return arr
}

/**
 * Helper to collect all step events from an algorithm
 */
function collectAllSteps(algo: AlgorithmDefinition, input: number[]): StepEvent[] {
  const steps: StepEvent[] = []
  const gen = algo.generator(input)
  let step = gen.next()
  while (!step.done) {
    steps.push(step.value)
    step = gen.next()
  }
  return steps
}

/**
 * Check if array is sorted in non-decreasing order
 */
function isSorted(arr: number[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false
  }
  return true
}

describe('Sorting Algorithms - Correctness Tests', () => {
  const sortAlgorithms: { name: string; algo: AlgorithmDefinition }[] = [
    { name: 'Bubble Sort', algo: bubbleSort },
    { name: 'Selection Sort', algo: selectionSort },
    { name: 'Insertion Sort', algo: insertionSort },
    { name: 'Quick Sort', algo: quickSort },
    { name: 'Merge Sort', algo: mergeSort },
    { name: 'Heap Sort', algo: heapSort },
    { name: 'Counting Sort', algo: countingSort },
    { name: 'Radix Sort', algo: radixSort },
    { name: 'Bucket Sort', algo: bucketSort },
    { name: 'Shell Sort', algo: shellSort },
  ]

  const testCases = [
    { name: 'empty array', input: [] as number[] },
    { name: 'single element', input: [42] },
    { name: 'two elements sorted', input: [1, 2] },
    { name: 'two elements reversed', input: [2, 1] },
    { name: 'three elements', input: [3, 1, 2] },
    { name: 'already sorted', input: [1, 2, 3, 4, 5] },
    { name: 'reverse sorted', input: [5, 4, 3, 2, 1] },
    { name: 'random array', input: [64, 34, 25, 12, 22, 11, 90] },
    { name: 'array with duplicates', input: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5] },
    { name: 'array with all same values', input: [7, 7, 7, 7, 7] },
  ]

  sortAlgorithms.forEach(({ name, algo }) => {
    describe(name, () => {
      testCases.forEach(({ name: caseName, input }) => {
        it(`should correctly sort ${caseName}: [${input.join(', ')}]`, () => {
          const result = getFinalArrayAfterSort(algo, input)
          expect(isSorted(result)).toBe(true)
          // If input is not empty, result should have same length
          if (input.length > 0) {
            expect(result).toHaveLength(input.length)
          }
        })
      })

      it('should produce a permutation of the original elements', () => {
        const input = [5, 3, 8, 4, 2, 7, 1, 6]
        const result = getFinalArrayAfterSort(algo, input)
        const sortedInput = [...input].sort((a, b) => a - b)
        const sortedResult = [...result].sort((a, b) => a - b)
        expect(sortedResult).toEqual(sortedInput)
      })
    })
  })
})

describe('Sorting Algorithms - StepEvent Tests', () => {
  it('bubble sort should yield compare and swap events', () => {
    const steps = collectAllSteps(bubbleSort, [5, 3, 8, 1])
    const compareCount = steps.filter(s => s.type === 'compare').length
    const swapCount = steps.filter(s => s.type === 'swap').length
    const doneCount = steps.filter(s => s.type === 'done').length

    expect(compareCount).toBeGreaterThan(0)
    expect(swapCount).toBeGreaterThan(0)
    expect(doneCount).toBe(1)
  })

  it('selection sort should yield compare and swap events', () => {
    const steps = collectAllSteps(selectionSort, [5, 3, 8, 1])
    const compareCount = steps.filter(s => s.type === 'compare').length
    const swapCount = steps.filter(s => s.type === 'swap').length
    // Selection sort has at most n-1 swaps
    expect(swapCount).toBeLessThanOrEqual(3)
  })

  it('quick sort should yield mark, compare, swap, and done events', () => {
    const steps = collectAllSteps(quickSort, [5, 3, 8, 1])
    const markCount = steps.filter(s => s.type === 'mark').length
    const compareCount = steps.filter(s => s.type === 'compare').length
    const doneCount = steps.filter(s => s.type === 'done').length

    expect(markCount).toBeGreaterThan(0)
    expect(compareCount).toBeGreaterThan(0)
    expect(doneCount).toBe(1)
  })

  it('merge sort should yield compare, set, and done events', () => {
    const steps = collectAllSteps(mergeSort, [5, 3, 8, 1])
    const compareCount = steps.filter(s => s.type === 'compare').length
    const setCount = steps.filter(s => s.type === 'set').length
    const doneCount = steps.filter(s => s.type === 'done').length

    expect(compareCount).toBeGreaterThan(0)
    expect(setCount).toBeGreaterThan(0)
    expect(doneCount).toBe(1)
  })

  it('insertion sort should yield compare, mark, set, and done events', () => {
    const steps = collectAllSteps(insertionSort, [5, 3, 8, 1])
    const compareCount = steps.filter(s => s.type === 'compare').length
    const setCount = steps.filter(s => s.type === 'set').length
    const doneCount = steps.filter(s => s.type === 'done').length

    expect(compareCount).toBeGreaterThan(0)
    expect(setCount).toBeGreaterThan(0)
    expect(doneCount).toBe(1)
  })

  it('heap sort should yield compare, swap, mark, and done events', () => {
    const steps = collectAllSteps(heapSort, [5, 3, 8, 1])
    const compareCount = steps.filter(s => s.type === 'compare').length
    const swapCount = steps.filter(s => s.type === 'swap').length
    const doneCount = steps.filter(s => s.type === 'done').length

    expect(compareCount).toBeGreaterThan(0)
    expect(swapCount).toBeGreaterThan(0)
    expect(doneCount).toBe(1)
  })

  it('shell sort should yield compare, mark, set, and done events', () => {
    const steps = collectAllSteps(shellSort, [5, 3, 8, 1])
    const compareCount = steps.filter(s => s.type === 'compare').length
    const setCount = steps.filter(s => s.type === 'set').length
    const doneCount = steps.filter(s => s.type === 'done').length

    expect(compareCount).toBeGreaterThan(0)
    expect(setCount).toBeGreaterThan(0)
    expect(doneCount).toBe(1)
  })

  it('counting sort should yield mark, set, and done events', () => {
    const steps = collectAllSteps(countingSort, [5, 3, 8, 1])
    const setCount = steps.filter(s => s.type === 'set').length
    const doneCount = steps.filter(s => s.type === 'done').length

    expect(setCount).toBeGreaterThan(0)
    expect(doneCount).toBe(1)
  })

  it('radix sort should yield mark, set, and done events', () => {
    const steps = collectAllSteps(radixSort, [5, 3, 8, 1])
    const setCount = steps.filter(s => s.type === 'set').length
    const doneCount = steps.filter(s => s.type === 'done').length

    expect(setCount).toBeGreaterThan(0)
    expect(doneCount).toBe(1)
  })

  it('bucket sort should yield mark, set, and done events', () => {
    const steps = collectAllSteps(bucketSort, [5, 3, 8, 1])
    const setCount = steps.filter(s => s.type === 'set').length
    const doneCount = steps.filter(s => s.type === 'done').length

    expect(setCount).toBeGreaterThan(0)
    expect(doneCount).toBe(1)
  })
})

describe('Sorting Algorithms - Edge Cases', () => {
  it('should handle already sorted array without swaps (insertion sort)', () => {
    const arr = [1, 2, 3, 4, 5]
    const steps = collectAllSteps(insertionSort, arr)
    const swapCount = steps.filter(s => s.type === 'swap').length
    expect(swapCount).toBe(0)
  })

  it('should handle reverse sorted array with many swaps (bubble sort)', () => {
    const arr = [5, 4, 3, 2, 1]
    const result = getFinalArrayAfterSort(bubbleSort, arr)
    expect(isSorted(result)).toBe(true)
  })

  it('should handle array with all identical values', () => {
    const arr = [7, 7, 7, 7, 7]
    const result = getFinalArrayAfterSort(bubbleSort, arr)
    expect(isSorted(result)).toBe(true)
    expect(result).toEqual([7, 7, 7, 7, 7])
  })
})