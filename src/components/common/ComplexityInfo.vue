<script setup lang="ts">
import { useAlgorithmStore } from '@/stores/algorithm'

const store = useAlgorithmStore()
</script>

<template>
  <div v-if="store.currentAlgo" class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
    <h3 class="text-sm font-semibold text-slate-700 mb-2">复杂度</h3>
    <div class="grid grid-cols-2 gap-2 text-sm">
      <div>
        <span class="text-slate-500">平均时间</span>
        <div class="font-mono text-slate-800">{{ store.currentAlgo.meta.complexity.time }}</div>
      </div>
      <div>
        <span class="text-slate-500">空间</span>
        <div class="font-mono text-slate-800">{{ store.currentAlgo.meta.complexity.space }}</div>
      </div>
      <div v-if="store.currentAlgo.meta.complexity.timeBest">
        <span class="text-slate-500">最好时间</span>
        <div class="font-mono text-slate-800">{{ store.currentAlgo.meta.complexity.timeBest }}</div>
      </div>
      <div v-if="store.currentAlgo.meta.complexity.timeWorst">
        <span class="text-slate-500">最坏时间</span>
        <div class="font-mono text-slate-800">{{ store.currentAlgo.meta.complexity.timeWorst }}</div>
      </div>
    </div>
    <div class="mt-2 flex gap-3 text-xs text-slate-500">
      <span v-if="store.currentAlgo.meta.stable !== undefined">
        {{ store.currentAlgo.meta.stable ? '稳定' : '不稳定' }}
      </span>
      <span v-if="store.currentAlgo.meta.inPlace !== undefined">
        {{ store.currentAlgo.meta.inPlace ? '原地排序' : '非原地' }}
      </span>
    </div>
  </div>
</template>
