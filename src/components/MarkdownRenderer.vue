<script setup lang="ts">
import { marked } from 'marked'
import { computed } from 'vue'
const props = defineProps<{ markdown: string }>()
const renderedMarkdown = computed(() => marked(props.markdown))
</script>
<template>
  <div class="prose prose-invert overflow-scroll" v-html="renderedMarkdown"></div>
</template>
