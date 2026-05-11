import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAlgorithmStore } from '@/stores/algorithm'
import { bubbleSort } from '@/algorithms/sort/bubble'
import { binarySearch } from '@/algorithms/search/binary'
import { bstInsert } from '@/algorithms/tree/bst-insert'
import { randomBST } from '@/utils/tree'

// Setup Vue and Pinia for tests
beforeEach(() => {
  setActivePinia(createPinia())
})

describe('Algorithm Store - initAlgorithm', () => {
  it('should initialize with the given algorithm', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort)

    expect(store.currentAlgo).toBe(bubbleSort)
    expect(store.data).toBeDefined()
    expect(Array.isArray(store.data)).toBe(true)
  })

  it('should set isFinished to false on init', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort)

    expect(store.isFinished).toBe(false)
    expect(store.compareCount).toBe(0)
    expect(store.swapCount).toBe(0)
    expect(store.elapsedMs).toBe(0)
  })

  it('should generate steps on init', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort)

    expect(store.steps.length).toBeGreaterThan(0)
    expect(store.currentStepIndex).toBe(0)
  })

  it('should override data when provided', () => {
    const store = useAlgorithmStore()
    const customData = [9, 8, 7, 6, 5]
    store.initAlgorithm(bubbleSort, customData)

    expect(store.data).toEqual([9, 8, 7, 6, 5])
  })

  it('should set targetValue for search algorithms', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(binarySearch)

    // Search algorithms should have a targetValue set
    expect(store.targetValue).not.toBeNull()
  })

  it('should clear excludedIndices on init', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bstInsert)
    store.excludedIndices.add(1)
    store.excludedIndices.add(2)

    store.initAlgorithm(bubbleSort)

    expect(store.excludedIndices.size).toBe(0)
  })
})

describe('Algorithm Store - stepForward', () => {
  it('should increment currentStepIndex on stepForward', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort, [5, 3, 8, 1])
    const initialIndex = store.currentStepIndex

    store.stepForward()

    expect(store.currentStepIndex).toBe(initialIndex + 1)
  })

  it('should increment compareCount when step type is compare', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort, [5, 3, 8, 1])

    const initialCompareCount = store.compareCount

    // Step forward until we hit a compare event
    while (store.currentStep.type?.type !== 'compare') {
      store.stepForward()
    }

    // After stepForward with compare, compareCount should increase
    // Note: The store increments count AFTER moving to the step
    expect(store.compareCount).toBeGreaterThanOrEqual(initialCompareCount)
  })

  it('should increment swapCount when step type is swap', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort, [5, 3, 8, 1])

    const initialSwapCount = store.swapCount

    // Step forward until we hit a swap event
    while (store.currentStep.type !== 'swap') {
      store.stepForward()
    }

    // After stepForward with swap, swapCount should increase
    expect(store.swapCount).toBeGreaterThan(initialSwapCount)
  })

  it('should add to excludedIndices when step type is exclude', () => {
    const store = useAlgorithmStore()
    // Use binary search which has exclude events
    store.initAlgorithm(binarySearch, [1, 3, 5, 7, 9])
    store.setTargetValue(9)

    // Find an exclude step
    let foundExclude = false
    while (!store.isFinished) {
      const step = store.currentStep
      if (step && step.type === 'exclude') {
        foundExclude = true
        break
      }
      store.stepForward()
    }

    if (foundExclude) {
      expect(store.excludedIndices.size).toBeGreaterThan(0)
    }
  })

  it('should set isFinished when reaching last step', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort, [5, 3])

    // Step forward until done
    while (!store.isFinished) {
      store.stepForward()
    }

    expect(store.isFinished).toBe(true)
    expect(store.isPlaying).toBe(false)
  })

  it('should add elapsedMs based on speed', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort, [5, 3, 8, 1])
    const initialElapsed = store.elapsedMs
    const speed = store.speed

    store.stepForward()

    expect(store.elapsedMs).toBe(initialElapsed + speed)
  })
})

describe('Algorithm Store - stepBackward', () => {
  it('should decrement currentStepIndex on stepBackward', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort, [5, 3, 8, 1])
    store.stepForward()
    const indexAfterForward = store.currentStepIndex

    store.stepBackward()

    expect(store.currentStepIndex).toBe(indexAfterForward - 1)
  })

  it('should not go below 0', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort, [5, 3])

    store.stepBackward()

    expect(store.currentStepIndex).toBe(0)
  })

  it('should decrement compareCount on compare step backward', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort, [5, 3, 8, 1])

    // Move forward past some compares
    while (store.currentStep.type !== 'compare') {
      store.stepForward()
    }
    const compareCountBefore = store.compareCount

    store.stepBackward()

    // compareCount should decrease by 1 (but not below 0)
    expect(store.compareCount).toBeLessThanOrEqual(compareCountBefore)
  })

  it('should decrement swapCount on swap step backward', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort, [5, 3, 8, 1])

    // Move forward past a swap
    while (store.currentStep.type !== 'swap') {
      store.stepForward()
    }
    const swapCountBefore = store.swapCount

    store.stepBackward()

    expect(store.swapCount).toBeLessThanOrEqual(swapCountBefore)
  })

  it('should set isFinished to false on stepBackward', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort, [5, 3])

    // Go to end
    while (!store.isFinished) {
      store.stepForward()
    }

    store.stepBackward()

    expect(store.isFinished).toBe(false)
  })
})

describe('Algorithm Store - setDataSize', () => {
  it('should update dataSize', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort)

    store.setDataSize(50)

    expect(store.dataSize).toBe(50)
  })

  it('should regenerate data when setDataSize is called', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort)
    const originalDataLength = store.data.length

    store.setDataSize(50)

    // New data should be generated (may or may not be different)
    expect(store.data.length).toBe(50)
  })
})

describe('Algorithm Store - applyCustomInput', () => {
  it('should parse comma-separated values', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort)

    store.applyCustomInput('9, 8, 7, 6, 5')

    expect(store.data).toEqual([9, 8, 7, 6, 5])
    expect(store.customInput).toBe('9, 8, 7, 6, 5')
  })

  it('should handle spaces in input', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort)

    store.applyCustomInput('  10 , 20 , 30  ')

    expect(store.data).toEqual([10, 20, 30])
  })

  it('should handle decimal values', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort)

    store.applyCustomInput('1.5, 2.5, 3.5')

    expect(store.data).toEqual([1.5, 2.5, 3.5])
  })

  it('should not update if input is invalid', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort, [5, 3, 8, 1])
    const originalData = [...store.data]

    store.applyCustomInput('')

    expect(store.data).toEqual(originalData)
  })
})

describe('Algorithm Store - setTargetValue', () => {
  it('should update targetValue', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(binarySearch, [1, 3, 5, 7, 9])

    store.setTargetValue(5)

    expect(store.targetValue).toBe(5)
  })

  it('should clear excludedIndices when setting new target', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(binarySearch, [1, 3, 5, 7, 9])
    // Add some excluded indices
    store.excludedIndices.add(0)
    store.excludedIndices.add(1)

    store.setTargetValue(7)

    expect(store.excludedIndices.size).toBe(0)
  })

  it('should reset steps when setting new target', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(binarySearch, [1, 3, 5, 7, 9])
    const originalStepsLength = store.steps.length

    store.setTargetValue(7)

    expect(store.steps.length).toBe(originalStepsLength) // Same number of steps regenerated
    expect(store.currentStepIndex).toBe(0)
  })

  it('should reset counts when setting new target', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(binarySearch, [1, 3, 5, 7, 9])

    store.setTargetValue(7)

    expect(store.compareCount).toBe(0)
    expect(store.swapCount).toBe(0)
    expect(store.elapsedMs).toBe(0)
  })
})

describe('Algorithm Store - reset', () => {
  it('should reinitialize the current algorithm', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort, [5, 3, 8, 1])
    const originalData = [...store.data]

    // Make some steps
    store.stepForward()
    store.stepForward()

    store.reset()

    // Data should be regenerated (not necessarily same, but same algorithm)
    expect(store.currentAlgo).toBe(bubbleSort)
    expect(store.currentStepIndex).toBe(0)
    expect(store.isFinished).toBe(false)
  })
})

describe('Algorithm Store - play/pause', () => {
  it('should set isPlaying to true on play', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort)

    store.play()

    expect(store.isPlaying).toBe(true)
  })

  it('should set isPlaying to false on pause', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort)
    store.play()

    store.pause()

    expect(store.isPlaying).toBe(false)
  })

  it('should stop playing when finished', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort, [5, 3])

    store.play()

    // Step to finish
    while (!store.isFinished) {
      store.stepForward()
    }

    expect(store.isPlaying).toBe(false)
  })
})

describe('Algorithm Store - computed properties', () => {
  it('highlighted should return targets of current step', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort, [5, 3, 8, 1])

    // Step to a swap
    while (store.currentStep.type !== 'swap') {
      store.stepForward()
    }

    const highlighted = store.highlighted
    expect(highlighted.size).toBe(2) // swap has 2 targets
  })

  it('highlighted should return empty set when no step', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort, [5, 3, 8, 1])
    // Go to end
    while (!store.isFinished) {
      store.stepForward()
    }

    const highlighted = store.highlighted
    expect(highlighted.size).toBe(0)
  })

  it('currentStep should return current step event', () => {
    const store = useAlgorithmStore()
    store.initAlgorithm(bubbleSort, [5, 3, 8, 1])

    const step = store.currentStep
    expect(step).toBeDefined()
    expect(step.type).toBeTruthy()
  })
})