<script setup lang="ts">
import CodeMirror from './CodeMirror.vue'
const value = defineModel<string>()
</script>

<template>
  <CodeMirror class="h-full" v-model="value" />
</template>
