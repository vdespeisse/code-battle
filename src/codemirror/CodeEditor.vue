<script setup lang="ts">
import CodeMirror from './CodeMirror.vue'
const value = defineModel<string>()
</script>

<template>
  <CodeMirror v-model="value" />
</template>
