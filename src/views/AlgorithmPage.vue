<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useAlgorithmStore } from '@/stores/algorithm'
import { categories } from '@/algorithms'
import VisualizerContainer from '@/components/visualizers/VisualizerContainer.vue'
import ControlBar from '@/components/common/ControlBar.vue'
import PseudoCodePanel from '@/components/common/PseudoCodePanel.vue'
import ComplexityInfo from '@/components/common/ComplexityInfo.vue'
import StatsPanel from '@/components/common/StatsPanel.vue'
import DataConfigPanel from '@/components/common/DataConfigPanel.vue'

const props = defineProps<{ algorithmId: string }>()
const store = useAlgorithmStore()

const algorithm = computed(() => {
  for (const cat of categories) {
    const found = cat.algorithms.find(a => a.meta.id === props.algorithmId)
    if (found) return found
  }
  return null
})

watch(() => props.algorithmId, (id) => {
  if (id && algorithm.value) {
    store.initAlgorithm(algorithm.value)
  }
}, { immediate: true })

onMounted(() => {
  if (algorithm.value && store.steps.length === 0) {
    store.initAlgorithm(algorithm.value)
  }
})

onUnmounted(() => {
  store.dispose()
})

// Keyboard controls
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') store.stepForward()
  if (e.key === 'ArrowLeft') store.stepBackward()
  if (e.key === ' ') {
    e.preventDefault()
    store.isPlaying ? store.pause() : store.play()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div v-if="algorithm" class="max-w-7xl mx-auto px-4 py-6">
    <!-- Header -->
    <div class="mb-4">
      <div class="flex items-center gap-2 text-sm text-slate-500 mb-1">
        <RouterLink :to="`/${algorithm.meta.category}`" class="hover:text-blue-600">
          {{ algorithm.meta.categoryLabel }}
        </RouterLink>
        <span>/</span>
        <span>{{ algorithm.meta.name }}</span>
      </div>
      <h1 class="text-2xl font-bold text-slate-900">{{ algorithm.meta.name }}</h1>
      <p class="text-slate-600 mt-1">{{ algorithm.meta.summary }}</p>
    </div>

    <!-- Main content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
      <!-- Visualizer -->
      <div class="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden" style="height: 400px;">
        <VisualizerContainer
          :visual-type="algorithm.visualType"
          :data="store.data"
          :current-step="store.currentStep"
          :highlighted="store.highlighted"
          :excluded-indices="store.excludedIndices"
          :data-options="algorithm.visualConfig?.dataOptions"
        />
      </div>

      <!-- Right panel -->
      <div class="space-y-4">
        <PseudoCodePanel />
        <ComplexityInfo />
        <DataConfigPanel />
      </div>
    </div>

    <!-- Control bar -->
    <div class="mb-4">
      <ControlBar />
    </div>

    <!-- Stats -->
    <StatsPanel />

    <!-- Progress bar -->
    <div class="mt-4 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
      <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
        <span>进度</span>
        <span>{{ store.currentStepIndex }} / {{ store.steps.length }}</span>
      </div>
      <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          class="h-full bg-blue-600 rounded-full transition-all duration-200"
          :style="{ width: `${store.steps.length ? (store.currentStepIndex / store.steps.length) * 100 : 0}%` }"
        />
      </div>
    </div>
  </div>

  <div v-else class="max-w-7xl mx-auto px-4 py-12 text-center">
    <h1 class="text-2xl font-bold text-slate-900">算法未找到</h1>
    <RouterLink to="/" class="text-blue-600 hover:underline mt-4 inline-block">
      返回首页
    </RouterLink>
  </div>
</template>
