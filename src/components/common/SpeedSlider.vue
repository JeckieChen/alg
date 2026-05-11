<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ modelValue: number }>()
const emit = defineEmits<{ 'update:modelValue': [v: number] }>()

const speedOptions = [
  { label: '0.5x', value: 600 },
  { label: '1x', value: 300 },
  { label: '1.5x', value: 200 },
  { label: '2x', value: 150 },
  { label: '4x', value: 75 },
]

const index = computed(() => speedOptions.findIndex(o => o.value === props.modelValue))

function onChange(e: Event) {
  const val = parseInt((e.target as HTMLInputElement).value)
  emit('update:modelValue', speedOptions[val].value)
}
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-xs text-slate-500">速度</span>
    <input
      type="range"
      min="0"
      :max="speedOptions.length - 1"
      step="1"
      :value="index"
      @input="onChange"
      class="w-24 accent-blue-600"
    />
    <span class="text-xs text-slate-600 w-8">{{ speedOptions[index]?.label }}</span>
  </div>
</template>
