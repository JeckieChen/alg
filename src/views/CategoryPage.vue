<script setup lang="ts">
import { computed } from 'vue'
import { categories } from '@/algorithms'

const props = defineProps<{ categoryId: string }>()

const category = computed(() =>
  categories.find(c => c.id === props.categoryId)
)
</script>

<template>
  <div v-if="category" class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900">{{ category.label }}</h1>
      <p class="text-slate-600 mt-2">{{ category.description }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <RouterLink
        v-for="algo in category.algorithms"
        :key="algo.meta.id"
        :to="`/${category.id}/${algo.meta.id}`"
        class="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition-all"
      >
        <h3 class="font-semibold text-slate-800 mb-1">{{ algo.meta.name }}</h3>
        <p class="text-sm text-slate-500 mb-3">{{ algo.meta.summary }}</p>
        <div class="flex gap-2 text-xs">
          <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-mono">
            {{ algo.meta.complexity.time }}
          </span>
          <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-mono">
            {{ algo.meta.complexity.space }}
          </span>
        </div>
      </RouterLink>
    </div>
  </div>

  <div v-else class="max-w-7xl mx-auto px-4 py-12 text-center">
    <h1 class="text-2xl font-bold text-slate-900">分类未找到</h1>
    <RouterLink to="/" class="text-blue-600 hover:underline mt-4 inline-block">
      返回首页
    </RouterLink>
  </div>
</template>
