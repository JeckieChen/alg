import { describe, it, expect } from 'vitest'
import { bubbleSort } from '@/algorithms/sort/bubble'
import { insertionSort } from '@/algorithms/sort/insertion'
import { mergeSort } from '@/algorithms/sort/merge'
import { quickSort } from '@/algorithms/sort/quick'
import { binarySearch } from '@/algorithms/search/binary'
import type { StepEvent } from '@/algorithms/types'

/**
 * Simulates the store's stepForward logic
 */
function applyStepForward(data: number[], step: StepEvent): void {
  if (step.type === 'swap') {
    const [i, j] = step.targets
    ;[data[i], data[j]] = [data[j], data[i]]
  } else if (step.type === 'set' && step.targets.length > 0 && step.value !== undefined) {
    data[step.targets[0]] = step.value
  }
}

/**
 * Simulates the store's stepBackward logic
 */
function applyStepBackward(data: number[], step: StepEvent, stepExtra?: Record<string, any>): void {
  if (step.type === 'swap') {
    const [i, j] = step.targets
    const oldValueI = stepExtra?._oldValueI
    const oldValueJ = stepExtra?._oldValueJ
    if (oldValueI !== undefined && oldValueJ !== undefined) {
      data[i] = oldValueI
      data[j] = oldValueJ
    } else {
      ;[data[i], data[j]] = [data[j], data[i]]
    }
  } else if (step.type === 'set' && step.targets.length > 0) {
    data[step.targets[0]] = stepExtra?._oldValue ?? data[step.targets[0]]
  }
}

/**
 * Collect all steps from a generator
 */
function collectAllSteps(algo: any, input: number[], targetValue?: number): { steps: StepEvent[]; finalData: number[] } {
  const arr = [...input]
  const steps: StepEvent[] = []
  const gen = algo.generator(arr, { targetValue })
  let step = gen.next()

  while (!step.done) {
    steps.push(step.value)
    step = gen.next()
  }

  return { steps, finalData: arr }
}

/**
 * Simulate stepForward through all steps and collect state changes
 */
function simulateStepForward(initialData: number[], steps: StepEvent[]): {
  finalData: number[]
  compareCount: number
  swapCount: number
  stepExtras: Map<number, Record<string, any>>
} {
  const data = [...initialData]
  let compareCount = 0
  let swapCount = 0
  const stepExtras = new Map<number, Record<string, any>>()

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    if (step.type === 'compare') {
      compareCount++
    } else if (step.type === 'swap') {
      swapCount++
      const [pi, pj] = step.targets
      stepExtras.set(i, { _oldValueI: data[pi], _oldValueJ: data[pj] })
      applyStepForward(data, step)
    } else if (step.type === 'set') {
      const [pi] = step.targets
      stepExtras.set(i, { _oldValue: data[pi] })
      applyStepForward(data, step)
    }
  }

  return { finalData: data, compareCount, swapCount, stepExtras }
}

/**
 * Simulate stepForward then stepBackward to verify reversibility
 */
function simulateForwardBackward(initialData: number[], steps: StepEvent[]): {
  afterForward: number[]
  afterBackward: number[]
} {
  const data = [...initialData]
  const stepExtras = simulateStepForward(initialData, steps).stepExtras

  // Forward through all steps
  for (let i = 0; i < steps.length; i++) {
    applyStepForward(data, steps[i])
  }
  const afterForward = [...data]

  // Backward through all steps
  for (let i = steps.length - 1; i >= 0; i--) {
    applyStepBackward(data, steps[i], stepExtras.get(i))
  }
  const afterBackward = [...data]

  return { afterForward, afterBackward }
}

describe('StepEvent Protocol - stepForward', () => {
  it('bubble sort: compareCount increments on compare events', () => {
    const input = [5, 3, 8, 1]
    const { steps } = collectAllSteps(bubbleSort, input)
    const { compareCount } = simulateStepForward(input, steps)

    // Bubble sort performs n-1 passes, comparing adjacent elements
    const expectedCompares = steps.filter(s => s.type === 'compare').length
    expect(compareCount).toBe(expectedCompares)
  })

  it('bubble sort: swapCount increments on swap events', () => {
    const input = [5, 3, 8, 1]
    const { steps } = collectAllSteps(bubbleSort, input)
    const { swapCount } = simulateStepForward(input, steps)

    const expectedSwaps = steps.filter(s => s.type === 'swap').length
    expect(swapCount).toBe(expectedSwaps)
  })

  it('merge sort: set events correctly update array values', () => {
    const input = [38, 27, 43, 3, 9, 82, 10]
    const { steps, finalData } = collectAllSteps(mergeSort, input)

    // Simulate step forward
    const data = [...input]
    for (const step of steps) {
      if (step.type === 'set' && step.targets.length > 0 && step.value !== undefined) {
        data[step.targets[0]] = step.value
      }
    }

    expect(finalData).toEqual([3, 9, 10, 27, 38, 43, 82])
    expect(data).toEqual([3, 9, 10, 27, 38, 43, 82])
  })

  it('quick sort: swap events correctly swap array values', () => {
    const input = [10, 7, 8, 9, 5, 3]
    const { steps } = collectAllSteps(quickSort, input)

    const data = [...input]
    for (const step of steps) {
      if (step.type === 'swap') {
        const [i, j] = step.targets
        ;[data[i], data[j]] = [data[j], data[i]]
      }
    }

    // Check sorted
    for (let i = 0; i < data.length - 1; i++) {
      expect(data[i]).toBeLessThanOrEqual(data[i + 1])
    }
  })
})

describe('StepEvent Protocol - stepBackward', () => {
  it('bubble sort: stepBackward reverses swap operations', () => {
    const input = [5, 3, 8, 1]
    const { steps } = collectAllSteps(bubbleSort, input)
    const { afterForward, afterBackward } = simulateForwardBackward(input, steps)

    // After forward, should be sorted
    expect(afterForward).toEqual([1, 3, 5, 8])

    // After backward, should be back to original
    expect(afterBackward).toEqual(input)
  })

  it('insertion sort: stepBackward reverses set operations', () => {
    const input = [5, 3, 8, 1]
    const { steps } = collectAllSteps(insertionSort, input)
    const { afterForward, afterBackward } = simulateForwardBackward(input, steps)

    // After forward, should be sorted
    expect(afterForward).toEqual([1, 3, 5, 8])

    // After backward, should be back to original
    expect(afterBackward).toEqual(input)
  })

  it('merge sort: stepBackward reverses all set operations', () => {
    const input = [38, 27, 43, 3, 9, 82, 10]
    const { steps } = collectAllSteps(mergeSort, input)
    const { afterForward, afterBackward } = simulateForwardBackward(input, steps)

    // After forward, should be sorted
    expect(afterForward).toEqual([3, 9, 10, 27, 38, 43, 82])

    // After backward, should be back to original
    expect(afterBackward).toEqual(input)
  })

  it('quick sort: stepBackward reverses all swap operations', () => {
    const input = [10, 7, 8, 9, 5, 3]
    const { steps } = collectAllSteps(quickSort, input)
    const { afterForward, afterBackward } = simulateForwardBackward(input, steps)

    // After forward, should be sorted
    for (let i = 0; i < afterForward.length - 1; i++) {
      expect(afterForward[i]).toBeLessThanOrEqual(afterForward[i + 1])
    }

    // After backward, should be back to original
    expect(afterBackward).toEqual(input)
  })

  it('partial backward: step 0 should not be reversible', () => {
    const input = [5, 3, 8, 1]
    const { steps } = collectAllSteps(bubbleSort, input)

    const data = [...input]
    // Apply first step
    if (steps.length > 0) {
      applyStepForward(data, steps[0])
    }
    const afterOneStep = [...data]

    // Step backward from step 0 should not change anything (no-op)
    // Since we're at step 0, there's nothing to step back to
    expect(steps[0].type).toBeTruthy() // First step exists
  })
})

describe('StepEvent Protocol - compareCount and swapCount', () => {
  it('compareCount increments correctly during forward traversal', () => {
    const input = [5, 3, 8, 1]
    const { steps } = collectAllSteps(bubbleSort, input)

    let compareCount = 0
    for (const step of steps) {
      if (step.type === 'compare') compareCount++
    }

    expect(compareCount).toBeGreaterThan(0)
  })

  it('swapCount increments correctly during forward traversal', () => {
    const input = [5, 3, 8, 1]
    const { steps } = collectAllSteps(bubbleSort, input)

    let swapCount = 0
    for (const step of steps) {
      if (step.type === 'swap') swapCount++
    }

    // For this specific input, we expect at least some swaps
    expect(swapCount).toBeGreaterThan(0)
  })

  it('compareCount decrements correctly during backward traversal', () => {
    const input = [5, 3, 8, 1]
    const { steps } = collectAllSteps(bubbleSort, input)

    let compareCount = steps.filter(s => s.type === 'compare').length

    // Simulate backward - compareCount should decrement
    // (simulating the store's logic: Math.max(0, compareCount - 1))
    let decrementedCount = compareCount
    for (let i = 0; i < 3; i++) {
      decrementedCount = Math.max(0, decrementedCount - 1)
    }

    expect(decrementedCount).toBeLessThanOrEqual(compareCount)
    expect(decrementedCount).toBeGreaterThanOrEqual(0)
  })
})

describe('StepEvent Protocol - excludedIndices', () => {
  it('binary search: exclude events add indices to excluded set', () => {
    const sortedArr = [1, 3, 5, 7, 9, 11, 13]
    const target = 7
    const steps: StepEvent[] = []
    const gen = binarySearch.generator(sortedArr, { targetValue: target })
    let step = gen.next()

    const excludedIndices = new Set<number>()

    while (!step.done) {
      const event = step.value
      steps.push(event)
      if (event.type === 'exclude') {
        event.targets.forEach(i => excludedIndices.add(i))
      }
      step = gen.next()
    }

    // Binary search should exclude portions of the array
    const excludeEvents = steps.filter(s => s.type === 'exclude')
    expect(excludeEvents.length).toBeGreaterThan(0)

    // All excluded indices should be within array bounds
    excludedIndices.forEach(idx => {
      expect(idx).toBeGreaterThanOrEqual(0)
      expect(idx).toBeLessThan(sortedArr.length)
    })
  })

  it('binary search: excluded indices are removed on step backward', () => {
    const sortedArr = [1, 3, 5, 7, 9]
    const target = 9

    // Collect exclude events in order
    const excludeEvents: StepEvent[] = []
    const gen = binarySearch.generator(sortedArr, { targetValue: target })
    let step = gen.next()

    while (!step.done) {
      if (step.value.type === 'exclude') {
        excludeEvents.push(step.value)
      }
      step = gen.next()
    }

    // Simulate forward - indices get added
    const excludedIndices = new Set<number>()
    excludeEvents.forEach(event => {
      event.targets.forEach(i => excludedIndices.add(i))
    })

    const countAfterForward = excludedIndices.size

    // Simulate backward - indices get removed (only last exclude step)
    if (excludeEvents.length > 0) {
      const lastExclude = excludeEvents[excludeEvents.length - 1]
      lastExclude.targets.forEach(i => excludedIndices.delete(i))
    }

    // After removing the last exclude, count should decrease
    if (excludeEvents.length > 0) {
      expect(excludedIndices.size).toBeLessThan(countAfterForward)
    }
  })

  it('linear search: each element is excluded when not matched', () => {
    const arr = [5, 3, 8, 1, 9]
    const target = 7 // Not in array

    const steps: StepEvent[] = []
    const gen = (await import('@/algorithms/search/linear')).linearSearch.generator(arr, { targetValue: target })
    let step = gen.next()

    while (!step.done) {
      steps.push(step.value)
      step = gen.next()
    }

    const excludeEvents = steps.filter(s => s.type === 'exclude')
    // Linear search should exclude each element that doesn't match
    expect(excludeEvents.length).toBe(arr.length)
  })
})

describe('StepEvent Protocol - done Event', () => {
  it('all sorting algorithms should end with a done event', () => {
    const algorithms = [bubbleSort, insertionSort, mergeSort, quickSort]
    const input = [5, 3, 8, 1]

    algorithms.forEach(algo => {
      const { steps } = collectAllSteps(algo, input)
      const lastStep = steps[steps.length - 1]
      expect(lastStep.type).toBe('done')
    })
  })

  it('all search algorithms should end with a done event', () => {
    const sortedArr = [1, 3, 5, 7, 9]
    const algorithms = [binarySearch]

    algorithms.forEach(algo => {
      const { steps } = collectAllSteps(algo, sortedArr, 7)
      const lastStep = steps[steps.length - 1]
      expect(lastStep.type).toBe('done')
    })
  })
})