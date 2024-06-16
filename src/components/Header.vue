<script setup lang="ts">
import useState from '../composables/state'
const { actions } = useState()
</script>
<template>
  <div class="flex flex-row items-center justify-between nav-height p-4">
    <div>OK</div>
    <button
      class="flex flex-row items-center gap-4 py-2 px-4 rounded text-green-600 bg-green-400 bg-opacity-10 hover:bg-opacity-30"
      @click="actions.run"
    >
      <div>Run</div>
      <fa-icon :icon="['fas', 'play']" />
    </button>
    <div>Settings</div>
  </div>
</template>

<style scoped></style>
