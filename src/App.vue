<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <AppHeader />
    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>
