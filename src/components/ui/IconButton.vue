<template>
  <button class="flex flex-row font-bold items-center gap-4 py-2 px-4 rounded" @click="ev => emit('click', ev)">
    <slot></slot>
    <fa-icon :icon="icon" />
  </button>
</template>
<script setup lang="ts">
const emit = defineEmits(['click'])
defineProps<{ icon: string[] }>()
</script>
