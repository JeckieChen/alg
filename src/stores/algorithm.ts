import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { AlgorithmDefinition, StepEvent } from '@/algorithms/types'

export const useAlgorithmStore = defineStore('algorithm', () => {
  const currentAlgo = ref<AlgorithmDefinition | null>(null)
  const data = ref<any>(null)
  const steps = ref<StepEvent[]>([])
  const currentStepIndex = ref(0)
  const isPlaying = ref(false)
  const speed = ref(300)
  const isFinished = ref(false)
  const compareCount = ref(0)
  const swapCount = ref(0)
  const elapsedMs = ref(0)
  const dataSize = ref(30)
  const customInput = ref('')
  const targetValue = ref<number | null>(null)
  const excludedIndices = ref<Set<number>>(new Set())

  const highlighted = computed(() => {
    const step = steps.value[currentStepIndex.value]
    if (!step) return new Set<number>()
    return new Set(step.targets)
  })

  const currentStep = computed(() => {
    return steps.value[currentStepIndex.value] ?? null
  })

  function initAlgorithm(algo: AlgorithmDefinition, overrideData?: any) {
    currentAlgo.value = algo
    if (overrideData !== undefined) {
      data.value = overrideData
    } else {
      data.value = algo.generateData()
    }
    // For search algorithms: pick a random target from the array
    if (algo.meta.category === 'search' && Array.isArray(data.value)) {
      const arr = data.value as number[]
      targetValue.value = arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null
    } else {
      targetValue.value = null
    }
    excludedIndices.value.clear()
    steps.value = [...algo.generator(data.value, { targetValue: targetValue.value ?? undefined })]
    currentStepIndex.value = 0
    isFinished.value = false
    compareCount.value = 0
    swapCount.value = 0
    elapsedMs.value = 0
  }

  function stepForward() {
    if (currentStepIndex.value >= steps.value.length - 1) {
      isFinished.value = true
      isPlaying.value = false
      return
    }
    currentStepIndex.value++
    const step = steps.value[currentStepIndex.value]
    if (step.type === 'compare') compareCount.value++
    if (step.type === 'swap') {
      swapCount.value++
      const [i, j] = step.targets
      ;(step as any)._oldValueI = data.value[i]
      ;(step as any)._oldValueJ = data.value[j]
      ;[data.value[i], data.value[j]] = [data.value[j], data.value[i]]
    }
    if (step.type === 'set' && step.targets.length > 0 && step.value !== undefined) {
      const idx = step.targets[0]
      ;(step as any)._oldValue = data.value[idx]
      data.value[idx] = step.value
    }
    if (step.type === 'exclude') {
      step.targets.forEach(i => excludedIndices.value.add(i))
    }
    elapsedMs.value += speed.value
  }

  function reset() {
    if (currentAlgo.value) initAlgorithm(currentAlgo.value)
  }

  function stepBackward() {
    if (currentStepIndex.value <= 0) return
    const step = steps.value[currentStepIndex.value]
    if (step.type === 'compare') compareCount.value = Math.max(0, compareCount.value - 1)
    if (step.type === 'swap') {
      swapCount.value = Math.max(0, swapCount.value - 1)
      const [i, j] = step.targets
      const oldI = (step as any)._oldValueI
      const oldJ = (step as any)._oldValueJ
      if (oldI !== undefined && oldJ !== undefined) {
        data.value[i] = oldI
        data.value[j] = oldJ
      } else {
        ;[data.value[i], data.value[j]] = [data.value[j], data.value[i]]
      }
    }
    if (step.type === 'set' && step.targets.length > 0) {
      const idx = step.targets[0]
      data.value[idx] = (step as any)._oldValue
    }
    if (step.type === 'exclude') {
      step.targets.forEach(i => excludedIndices.value.delete(i))
    }
    currentStepIndex.value--
    isFinished.value = false
  }

  let timer: ReturnType<typeof setInterval> | null = null
  function clearTimer() {
    if (timer) { clearInterval(timer); timer = null }
  }

  function play() { isPlaying.value = true }
  function pause() { isPlaying.value = false }

  watch([isPlaying, speed], ([playing, ms]) => {
    clearTimer()
    if (playing) {
      timer = setInterval(() => {
        stepForward()
        if (isFinished.value) pause()
      }, ms)
    }
  })

  function dispose() {
    clearTimer()
  }

  function setDataSize(size: number) {
    dataSize.value = size
    if (currentAlgo.value && currentAlgo.value.dataShape.kind === 'array') {
      const ds = currentAlgo.value.dataShape
      const newData = Array.from({ length: size }, () =>
        Math.floor(Math.random() * ((ds.max ?? 99) - (ds.min ?? 1) + 1)) + (ds.min ?? 1)
      )
      initAlgorithm(currentAlgo.value, newData)
    }
  }

  function applyCustomInput(input: string) {
    const nums = input.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))
    if (nums.length >= 1 && currentAlgo.value) {
      customInput.value = input
      initAlgorithm(currentAlgo.value, nums)
    }
  }

  function setTargetValue(value: number) {
    targetValue.value = value
    if (currentAlgo.value) {
      excludedIndices.value.clear()
      steps.value = [...currentAlgo.value.generator(data.value, { targetValue: value })]
      currentStepIndex.value = 0
      isFinished.value = false
      compareCount.value = 0
      swapCount.value = 0
      elapsedMs.value = 0
    }
  }

  return {
    currentAlgo, data, steps, currentStepIndex,
    isPlaying, speed, isFinished,
    compareCount, swapCount, elapsedMs, highlighted, currentStep,
    dataSize, customInput, targetValue, excludedIndices,
    initAlgorithm, stepForward, stepBackward, reset,
    play, pause, dispose, setDataSize, applyCustomInput, setTargetValue,
  }
})
