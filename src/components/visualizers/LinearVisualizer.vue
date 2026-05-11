<script setup lang="ts">
import { computed } from 'vue'
import type { StepEvent } from '@/algorithms/types'
import { STEP_COLORS } from '@/styles/colors'

const props = defineProps<{
  data: number[]
  currentStep: StepEvent | null
  highlighted: Set<number>
  excludedIndices?: Set<number>
}>()

const maxVal = computed(() => Math.max(...(props.data || [1]), 1))

function getBarColor(index: number): string {
  if (props.excludedIndices?.has(index)) return STEP_COLORS.excluded
  if (!props.currentStep) return STEP_COLORS.default
  const step = props.currentStep
  if (step.targets.includes(index)) {
    switch (step.type) {
      case 'compare': return STEP_COLORS.comparing
      case 'swap': return STEP_COLORS.swapping
      case 'mark': return STEP_COLORS.sorted
      case 'set': return STEP_COLORS.visiting
      case 'exclude': return STEP_COLORS.excluded
      default: return STEP_COLORS.default
    }
  }
  return STEP_COLORS.default
}
</script>

<template>
  <div class="w-full h-full flex items-end justify-center gap-px px-4 py-6">
    <div
      v-for="(val, i) in data"
      :key="i"
      class="flex-1 rounded-t-sm transition-all duration-200 flex flex-col justify-end items-center"
      :style="{
        height: `${(val / maxVal) * 100}%`,
        backgroundColor: getBarColor(i),
        minWidth: '2px',
        maxWidth: '40px',
      }"
    >
      <span
        v-if="data.length <= 50"
        class="text-[10px] text-white/80 mb-0.5 select-none"
      >
        {{ val }}
      </span>
    </div>
  </div>
</template>
