<script setup lang="ts">
import { categories } from '@/algorithms'
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-slate-900 mb-4">算法可视化学习平台</h1>
      <p class="text-lg text-slate-600 max-w-2xl mx-auto">
        通过交互式动画直观理解算法执行过程，让抽象的算法变得触手可及。
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <RouterLink
        v-for="cat in categories"
        :key="cat.id"
        :to="`/${cat.id}`"
        class="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-300 transition-all"
      >
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <svg v-if="cat.icon === 'bar-chart'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <svg v-else-if="cat.icon === 'search'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 class="text-lg font-semibold text-slate-800">{{ cat.label }}</h2>
        </div>
        <p class="text-sm text-slate-500 mb-4">{{ cat.description }}</p>
        <div class="flex items-center justify-between">
          <span class="text-xs text-slate-400">{{ cat.algorithms.length }} 个算法</span>
          <span class="text-sm text-blue-600 group-hover:underline">开始学习 →</span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
