<script setup lang="ts">
defineProps<{
  active: boolean
}>()
</script>
<template>
  <div class="panel bg-layer-1 h-full rounded overflow-hidden">
    <div class="block-header border-x-2 border-t-2" :class="active ? 'border-green-600' : 'border-layer-3'">
      <slot name="header"></slot>
    </div>
    <div class="panel-content border-x-2 border-b-2 border-layer-1" :class="active ? 'border-green-600' : 'border-layer-1'">
      <slot></slot>
    </div>
  </div>
</template>
<style scoped>
.panel-content {
  height: calc(100% - 36px);
}
</style>
