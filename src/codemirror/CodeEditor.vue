<script setup lang="ts">
import CodeMirror from './CodeMirror.vue'
const value = defineModel<string>()
const props = defineProps<{ mode: 'javascript' | 'markdown' | 'json' }>()
</script>

<template>
  <CodeMirror class="h-full" :mode="props.mode" v-model="value" />
</template>
