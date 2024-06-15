<script setup lang="ts">
import { ref } from 'vue'
import { runFunction } from './lib/run'
import CodeEditor from './codemirror/CodeEditor.vue'
const testFn = `export default function test(value) {
  console.log('test')
  return value + 1
}`
const result = ref()
const code = ref<string>(testFn)
async function test() {
  const res = await runFunction(code.value, [1])
  result.value = res
  return res
}
</script>

<template>
  <div>dsqdsq {{ result }} {{ code }}</div>
  <button @click="test">Click</button>
  <CodeEditor mode="js" filename="test" v-model="code" />
</template>

<style scoped></style>
