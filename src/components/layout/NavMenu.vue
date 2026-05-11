<script setup lang="ts">
import { ref } from 'vue'
import { useNavItems } from '@/router'

const navItems = useNavItems()
const openMenu = ref<string | null>(null)

function toggleMenu(id: string) {
  openMenu.value = openMenu.value === id ? null : id
}
</script>

<template>
  <nav class="hidden md:flex items-center gap-1">
    <div v-for="item in navItems" :key="item.path" class="relative">
      <button
        class="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
        @click="toggleMenu(item.path)"
        @mouseenter="openMenu = item.path"
      >
        {{ item.label }}
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        v-if="openMenu === item.path"
        class="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50"
        @mouseleave="openMenu = null"
      >
        <RouterLink
          v-for="child in item.children"
          :key="child.path"
          :to="child.path"
          class="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          @click="openMenu = null"
        >
          {{ child.label }}
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
