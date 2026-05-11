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

const capacity = computed(() => props.data.length)

const queueState = computed(() => {
  const extra = props.currentStep?.extra
  return {
    front: extra?.front ?? 0,
    rear: extra?.rear ?? 0,
    count: extra?.count ?? 0,
  }
})

const RADIUS = 120
const CENTER_X = 200
const CENTER_Y = 200

interface SlotInfo {
  index: number
  value: number
  x: number
  y: number
  angle: number
}

const slots = computed<SlotInfo[]>(() => {
  const n = capacity.value
  return props.data.map((val, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2
    return {
      index: i,
      value: val,
      x: CENTER_X + RADIUS * Math.cos(angle),
      y: CENTER_Y + RADIUS * Math.sin(angle),
      angle,
    }
  })
})

function getSlotColor(index: number): string {
  if (props.excludedIndices?.has(index)) return STEP_COLORS.excluded
  if (!props.currentStep) return '#475569'
  const step = props.currentStep
  if (step.targets.includes(index)) {
    switch (step.type) {
      case 'compare': return STEP_COLORS.comparing
      case 'visit': return STEP_COLORS.visiting
      case 'set': return STEP_COLORS.visiting
      case 'mark': return STEP_COLORS.sorted
      default: return '#475569'
    }
  }
  return '#475569'
}

function labelPos(index: number, dist: number) {
  const angle = (index / capacity.value) * 2 * Math.PI - Math.PI / 2
  return {
    x: CENTER_X + (RADIUS + dist) * Math.cos(angle),
    y: CENTER_Y + (RADIUS + dist) * Math.sin(angle),
  }
}

const totalWidth = 420
const totalHeight = 420
</script>

<template>
  <div class="w-full h-full flex items-center justify-center overflow-auto">
    <svg :width="totalWidth" :height="totalHeight" class="block">
      <!-- Connection ring -->
      <circle
        :cx="CENTER_X"
        :cy="CENTER_Y"
        :r="RADIUS"
        fill="none"
        stroke="#e2e8f0"
        stroke-width="2"
        stroke-dasharray="6 4"
      />

      <!-- Slots -->
      <g v-for="slot in slots" :key="slot.index">
        <circle
          :cx="slot.x"
          :cy="slot.y"
          r="26"
          :fill="getSlotColor(slot.index)"
          stroke="white"
          stroke-width="2"
          class="transition-all duration-300"
        />
        <text
          :x="slot.x"
          :y="slot.y + 4"
          text-anchor="middle"
          fill="white"
          font-size="12"
          font-weight="bold"
        >
          {{ slot.value || '' }}
        </text>
      </g>

      <!-- Index labels -->
      <g v-for="slot in slots" :key="`label-${slot.index}`">
        <text
          :x="labelPos(slot.index, 42).x"
          :y="labelPos(slot.index, 42).y + 4"
          text-anchor="middle"
          fill="#94a3b8"
          font-size="10"
        >
          {{ slot.index }}
        </text>
      </g>

      <!-- Front pointer -->
      <g v-if="queueState.count > 0">
        <text
          :x="labelPos(queueState.front, -50).x"
          :y="labelPos(queueState.front, -50).y + 4"
          text-anchor="middle"
          fill="#8B5CF6"
          font-size="11"
          font-weight="bold"
        >
          front
        </text>
      </g>

      <!-- Rear pointer -->
      <g>
        <text
          :x="labelPos((queueState.rear - 1 + capacity) % capacity, -50).x"
          :y="labelPos((queueState.rear - 1 + capacity) % capacity, -50).y + 4"
          text-anchor="middle"
          fill="#F59E0B"
          font-size="11"
          font-weight="bold"
        >
          rear
        </text>
      </g>
    </svg>
  </div>
</template>
