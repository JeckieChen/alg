<script setup lang="ts">
import { useAlgorithmStore } from '@/stores/algorithm'

const store = useAlgorithmStore()
</script>

<template>
  <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
    <h3 class="text-sm font-semibold text-slate-700 mb-2">统计数据</h3>
    <div class="grid grid-cols-3 gap-4 text-sm">
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-600">{{ store.compareCount }}</div>
        <div class="text-slate-500 text-xs">比较次数</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-red-500">{{ store.swapCount }}</div>
        <div class="text-slate-500 text-xs">交换次数</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-green-600">{{ store.currentStepIndex }}</div>
        <div class="text-slate-500 text-xs">已执行步</div>
      </div>
    </div>
    <div v-if="store.currentStep?.description" class="mt-3 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
      {{ store.currentStep.description }}
    </div>
    <div v-if="store.targetValue !== null" class="mt-3 flex items-center gap-2 text-sm">
      <span class="text-slate-500">搜索目标:</span>
      <span class="font-bold text-purple-600">{{ store.targetValue }}</span>
    </div>
  </div>
</template>
