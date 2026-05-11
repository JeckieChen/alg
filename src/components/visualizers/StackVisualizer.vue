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

const chars = computed(() => props.data.map(c => String.fromCharCode(c)))

const stackState = computed(() => {
  const extra = props.currentStep?.extra
  if (extra?.stack && Array.isArray(extra.stack)) {
    return extra.stack.map((c: number) => String.fromCharCode(c))
  }
  return []
})

const currentIndex = computed(() => {
  if (!props.currentStep) return -1
  const t = props.currentStep.targets
  if (t.length > 0 && props.currentStep.type === 'compare') return t[0]
  if (t.length > 0 && props.currentStep.type === 'visit') return t[0]
  if (t.length > 0 && props.currentStep.type === 'mark') return t[0]
  return -1
})

function getInputColor(index: number): string {
  if (props.excludedIndices?.has(index)) return STEP_COLORS.excluded
  if (index === currentIndex.value) {
    const type = props.currentStep?.type
    if (type === 'compare') return STEP_COLORS.comparing
    if (type === 'visit') return STEP_COLORS.visiting
    if (type === 'mark') return STEP_COLORS.sorted
    return STEP_COLORS.visiting
  }
  return '#cbd5e1'
}

const BOX_W = 44
const BOX_H = 44
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-start pt-6 gap-8 overflow-auto">
    <!-- Input string -->
    <div class="flex items-center gap-1">
      <div
        v-for="(ch, i) in chars"
        :key="i"
        class="flex items-center justify-center rounded-md text-white font-bold text-sm transition-all duration-300"
        :style="{
          width: `${BOX_W}px`,
          height: `${BOX_H}px`,
          backgroundColor: getInputColor(i),
          transform: highlighted.has(i) ? 'scale(1.1)' : 'scale(1)',
        }"
      >
        {{ ch }}
      </div>
    </div>

    <!-- Stack -->
    <div class="flex flex-col items-center gap-1 min-h-[200px]">
      <div class="text-xs text-slate-500 font-semibold mb-1">栈 (Stack)</div>
      <div class="flex flex-col-reverse items-center gap-1">
        <div
          v-for="(ch, i) in stackState"
          :key="i"
          class="flex items-center justify-center rounded-md text-white font-bold text-sm border-2 border-white shadow-sm"
          :style="{
            width: `${BOX_W}px`,
            height: `${BOX_H}px`,
            backgroundColor: i === stackState.length - 1 ? STEP_COLORS.visiting : '#475569',
          }"
        >
          {{ ch }}
        </div>
      </div>
      <div v-if="stackState.length === 0" class="text-sm text-slate-400 italic">空栈</div>
    </div>
  </div>
</template>
