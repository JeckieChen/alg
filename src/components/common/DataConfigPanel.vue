<script setup lang="ts">
import { ref } from 'vue'
import { useAlgorithmStore } from '@/stores/algorithm'

const store = useAlgorithmStore()
const inputValue = ref('')
const showInput = ref(false)
const targetInputValue = ref('')

function onSizeChange(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value)
  store.setDataSize(Math.max(5, Math.min(100, val)))
}

function applyInput() {
  store.applyCustomInput(inputValue.value)
  showInput.value = false
}

function applyTarget() {
  const val = parseFloat(targetInputValue.value)
  if (!isNaN(val)) {
    store.setTargetValue(val)
  }
}
</script>

<template>
  <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
    <h3 class="text-sm font-semibold text-slate-700 mb-3">数据配置</h3>

    <div class="mb-3">
      <label class="text-xs text-slate-500 mb-1 block">数据量 {{ store.dataSize }}</label>
      <input
        type="range"
        min="5"
        max="100"
        :value="store.dataSize"
        :disabled="store.isPlaying"
        @input="onSizeChange"
        class="w-full accent-blue-600"
      />
    </div>

    <button
      class="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
      @click="showInput = !showInput"
    >
      {{ showInput ? '收起' : '手动输入数据' }}
    </button>

    <div v-if="showInput" class="mt-2">
      <input
        v-model="inputValue"
        type="text"
        placeholder="如: 5,3,8,1,9"
        class="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @keyup.enter="applyInput"
      />
      <button
        class="mt-2 w-full text-sm px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        @click="applyInput"
      >
        应用
      </button>
    </div>

    <!-- Target value input for search algorithms -->
    <div v-if="store.currentAlgo?.meta.category === 'search'" class="mt-4 pt-4 border-t border-slate-200">
      <label class="text-xs text-slate-500 mb-1 block">目标值</label>
      <div class="flex gap-2">
        <input
          v-model="targetInputValue"
          type="number"
          placeholder="输入目标值"
          class="flex-1 text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="applyTarget"
        />
        <button
          class="px-3 py-2 text-sm rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
          @click="applyTarget"
        >
          查找
        </button>
      </div>
      <p class="text-[11px] text-slate-400 mt-1">二分/三分/插值搜索要求数据有序</p>
    </div>
  </div>
</template>
