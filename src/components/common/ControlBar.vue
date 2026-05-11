<script setup lang="ts">
import { useAlgorithmStore } from '@/stores/algorithm'
import SpeedSlider from './SpeedSlider.vue'

const store = useAlgorithmStore()
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
    <button
      class="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
      title="重置"
      @click="store.reset()"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    </button>

    <button
      v-if="!store.isPlaying"
      class="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
      title="播放"
      @click="store.play()"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
    <button
      v-else
      class="w-10 h-10 flex items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors"
      title="暂停"
      @click="store.pause()"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
      </svg>
    </button>

    <button
      class="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
      title="单步后退"
      @click="store.stepBackward()"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 5v14l-11-7zm-13 0v14H5V5h2z" />
      </svg>
    </button>

    <button
      class="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
      title="单步前进"
      @click="store.stepForward()"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4 5v14l11-7zm13 0v14h2V5h-2z" />
      </svg>
    </button>

    <div class="w-px h-6 bg-slate-200" />

    <SpeedSlider v-model="store.speed" />

    <div class="w-px h-6 bg-slate-200" />

    <button
      class="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
      @click="store.reset()"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      随机数据
    </button>
  </div>
</template>
