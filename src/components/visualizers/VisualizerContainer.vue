<script setup lang="ts">
import type { VisualType, StepEvent } from '@/algorithms/types'
import { defineAsyncComponent, computed } from 'vue'

const props = defineProps<{
  visualType: VisualType
  data: any
  currentStep: StepEvent | null
  highlighted: Set<number>
  excludedIndices?: Set<number>
  dataOptions?: Record<string, any>
}>()

const visualizerMap: Record<VisualType, any> = {
  linear: defineAsyncComponent(() => import('./LinearVisualizer.vue')),
  tree: defineAsyncComponent(() => import('./TreeVisualizer.vue')),
  graph: defineAsyncComponent(() => import('./LinearVisualizer.vue')),
  table: defineAsyncComponent(() => import('./LinearVisualizer.vue')),
  'linked-list': defineAsyncComponent(() => import('./LinkedListVisualizer.vue')),
  'array-2d': defineAsyncComponent(() => import('./LinearVisualizer.vue')),
  stack: defineAsyncComponent(() => import('./StackVisualizer.vue')),
  'circular-queue': defineAsyncComponent(() => import('./CircularQueueVisualizer.vue')),
}

const Visualizer = computed(() => visualizerMap[props.visualType])
</script>

<template>
  <component
    :is="Visualizer"
    :data="data"
    :current-step="currentStep"
    :highlighted="highlighted"
    :excluded-indices="excludedIndices"
    :data-options="dataOptions"
  />
</template>
