<script setup lang="ts">
import { useAlgorithmStore } from '@/stores/algorithm'

const store = useAlgorithmStore()
</script>

<template>
  <div class="bg-slate-900 rounded-xl p-4 overflow-auto max-h-full">
    <h3 class="text-sm font-semibold text-slate-300 mb-3">伪代码</h3>
    <div v-if="store.currentAlgo" class="font-mono text-sm space-y-1">
      <div
        v-for="(line, i) in store.currentAlgo.pseudoCode"
        :key="i"
        class="px-2 py-0.5 rounded transition-colors"
        :class="{
          'bg-blue-500/20 text-blue-300': store.currentStep && i === store.currentStepIndex % store.currentAlgo.pseudoCode.length,
          'text-slate-400': !store.currentStep || i !== store.currentStepIndex % store.currentAlgo.pseudoCode.length,
        }"
      >
        <span class="text-slate-600 select-none mr-2 w-6 inline-block text-right">{{ i + 1 }}</span>
        {{ line }}
      </div>
    </div>
  </div>
</template>
