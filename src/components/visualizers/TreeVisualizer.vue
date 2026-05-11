<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { StepEvent } from '@/algorithms/types'
import { STEP_COLORS } from '@/styles/colors'
import type { TreeData } from '@/utils/tree'

const props = defineProps<{
  data: TreeData | number[]
  currentStep: StepEvent | null
  highlighted: Set<number>
  excludedIndices?: Set<number>
}>()

const NODE_SIZE = 36
const LEVEL_HEIGHT = 60
const H_SPACING = 50

const containerRef = ref<HTMLDivElement>()
const containerWidth = ref(800)

onMounted(() => {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.clientWidth
  }
})

const isHeapArray = computed(() => Array.isArray(props.data))

const treeData = computed<TreeData>(() => {
  if (isHeapArray.value) {
    const arr = props.data as number[]
    const nodes = arr.map((val, i) => ({
      id: i,
      value: val,
      left: 2 * i + 1 < arr.length ? 2 * i + 1 : null,
      right: 2 * i + 2 < arr.length ? 2 * i + 2 : null,
    }))
    return { nodes, rootId: 0 }
  }
  return (props.data as TreeData) ?? { nodes: [], rootId: 0 }
})

const nodes = computed(() => treeData.value.nodes)
const rootId = computed(() => treeData.value.rootId)

const layout = computed(() => {
  const positions = new Map<number, { x: number; y: number }>()
  let index = 0

  function inorder(nodeId: number | null, depth: number) {
    if (nodeId === null) return
    const node = nodes.value[nodeId]
    if (!node) return
    inorder(node.left, depth + 1)
    positions.set(nodeId, {
      x: index * H_SPACING + H_SPACING / 2,
      y: depth * LEVEL_HEIGHT + NODE_SIZE,
    })
    index++
    inorder(node.right, depth + 1)
  }

  inorder(rootId.value, 0)

  const edges: { from: number; to: number }[] = []
  for (const node of nodes.value) {
    if (node.left !== null) edges.push({ from: node.id, to: node.left })
    if (node.right !== null) edges.push({ from: node.id, to: node.right })
  }

  const totalWidth = Math.max(index * H_SPACING + H_SPACING, containerWidth.value)
  const offsetX = (containerWidth.value - totalWidth) / 2 + totalWidth / 2

  return { positions, edges, totalWidth, offsetX }
})

function nodeX(id: number): number {
  const raw = layout.value.positions.get(id)?.x ?? 0
  return raw + layout.value.offsetX - layout.value.totalWidth / 2
}

function nodeY(id: number): number {
  return layout.value.positions.get(id)?.y ?? 0
}

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
  <div ref="containerRef" class="w-full h-full overflow-auto">
    <div class="relative mx-auto" :style="{ width: `${Math.max(layout.totalWidth, containerWidth)}px`, height: '100%' }">
      <svg class="absolute inset-0 w-full h-full pointer-events-none">
        <line
          v-for="edge in layout.edges"
          :key="`${edge.from}-${edge.to}`"
          :x1="nodeX(edge.from)"
          :y1="nodeY(edge.from)"
          :x2="nodeX(edge.to)"
          :y2="nodeY(edge.to)"
          stroke="#94a3b8"
          stroke-width="2"
        />
      </svg>

      <div
        v-for="node in nodes"
        :key="node.id"
        class="absolute flex items-center justify-center rounded-full text-white font-bold text-xs transition-all duration-300 select-none"
        :style="{
          left: `${nodeX(node.id) - NODE_SIZE / 2}px`,
          top: `${nodeY(node.id) - NODE_SIZE / 2}px`,
          width: `${NODE_SIZE}px`,
          height: `${NODE_SIZE}px`,
          backgroundColor: getNodeColor(node.id),
          boxShadow: highlighted.has(node.id) ? '0 0 12px rgba(139, 92, 246, 0.5)' : 'none',
          transform: highlighted.has(node.id) ? 'scale(1.15)' : 'scale(1)',
        }"
      >
        {{ node.value }}
      </div>
    </div>
  </div>
</template>
