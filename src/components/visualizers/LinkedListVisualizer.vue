<script setup lang="ts">
import { computed } from 'vue'
import type { StepEvent } from '@/algorithms/types'
import { STEP_COLORS } from '@/styles/colors'

const props = defineProps<{
  data: number[]
  currentStep: StepEvent | null
  highlighted: Set<number>
  excludedIndices?: Set<number>
  dataOptions?: { mode?: 'single' | 'dual'; splitAt?: 'half' | number }
}>()

const NODE_W = 56
const NODE_H = 40
const ARROW_W = 36
const GAP_Y = 80
const START_X = 40
const START_Y = 60

const isDual = computed(() => {
  const mode = props.dataOptions?.mode
  if (mode === 'dual') return true
  if (mode === 'single') return false
  // heuristic fallback
  return props.data.length > 12
})

const splitIndex = computed(() => {
  if (!isDual.value) return props.data.length
  const sp = props.dataOptions?.splitAt
  if (sp === 'half' || sp === undefined) return Math.floor(props.data.length / 2)
  return sp
})

const list1 = computed(() => props.data.slice(0, splitIndex.value))
const list2 = computed(() => props.data.slice(splitIndex.value))

interface NodeInfo {
  id: number
  value: number
  x: number
  y: number
  hasNext: boolean
}

function buildNodes(list: number[], offsetId: number, startY: number): NodeInfo[] {
  return list.map((val, i) => ({
    id: offsetId + i,
    value: val,
    x: START_X + i * (NODE_W + ARROW_W),
    y: startY,
    hasNext: i < list.length - 1,
  }))
}

const nodes1 = computed(() => buildNodes(list1.value, 0, START_Y))
const nodes2 = computed(() =>
  isDual.value ? buildNodes(list2.value, splitIndex.value, START_Y + GAP_Y) : []
)

const allNodes = computed(() => [...nodes1.value, ...nodes2.value])

const totalWidth = computed(() => {
  const maxLen = Math.max(nodes1.value.length, nodes2.value.length)
  return START_X + maxLen * (NODE_W + ARROW_W) + 20
})

const totalHeight = computed(() => (isDual.value ? START_Y + GAP_Y + NODE_H + 30 : START_Y + NODE_H + 30))

function getNodeColor(nodeId: number): string {
  if (props.excludedIndices?.has(nodeId)) return STEP_COLORS.excluded
  if (!props.currentStep) return '#475569'
  const step = props.currentStep
  if (step.targets.includes(nodeId)) {
    switch (step.type) {
      case 'compare': return STEP_COLORS.comparing
      case 'swap': return STEP_COLORS.swapping
      case 'mark': return STEP_COLORS.sorted
      case 'set': return STEP_COLORS.visiting
      case 'visit': return STEP_COLORS.visiting
      case 'exclude': return STEP_COLORS.excluded
      default: return '#475569'
    }
  }
  return '#475569'
}

</script>

<template>
  <div class="w-full h-full overflow-auto">
    <svg :width="Math.max(totalWidth, 400)" :height="Math.max(totalHeight, 200)" class="block mx-auto">
      <!-- Arrows for list1 -->
      <g v-for="(node, i) in nodes1" :key="`a1-${node.id}`">
        <line
          v-if="node.hasNext"
          :x1="node.x + NODE_W / 2"
          :y1="node.y"
          :x2="nodes1[i + 1].x - NODE_W / 2"
          :y2="nodes1[i + 1].y"
          stroke="#94a3b8"
          stroke-width="2"
          marker-end="url(#arrowhead)"
        />
      </g>

      <!-- Arrows for list2 -->
      <g v-for="(node, i) in nodes2" :key="`a2-${node.id}`">
        <line
          v-if="node.hasNext"
          :x1="node.x + NODE_W / 2"
          :y1="node.y"
          :x2="nodes2[i + 1].x - NODE_W / 2"
          :y2="nodes2[i + 1].y"
          stroke="#94a3b8"
          stroke-width="2"
          marker-end="url(#arrowhead)"
        />
      </g>

      <!-- Arrow marker definition -->
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
        </marker>
      </defs>

      <!-- Nodes -->
      <g v-for="node in allNodes" :key="`n-${node.id}`">
        <rect
          :x="node.x - NODE_W / 2"
          :y="node.y - NODE_H / 2"
          :width="NODE_W"
          :height="NODE_H"
          rx="6"
          :fill="getNodeColor(node.id)"
          stroke="white"
          stroke-width="2"
          class="transition-all duration-300"
        />
        <text
          :x="node.x"
          :y="node.y + 4"
          text-anchor="middle"
          fill="white"
          font-size="13"
          font-weight="bold"
        >
          {{ node.value }}
        </text>
      </g>

      <!-- Labels for dual mode -->
      <text v-if="isDual" :x="START_X" :y="START_Y - NODE_H / 2 - 10" fill="#64748b" font-size="12" font-weight="600">
        List 1
      </text>
      <text v-if="isDual" :x="START_X" :y="START_Y + GAP_Y - NODE_H / 2 - 10" fill="#64748b" font-size="12" font-weight="600">
        List 2
      </text>
    </svg>
  </div>
</template>
