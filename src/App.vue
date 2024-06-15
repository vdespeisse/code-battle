<script setup lang="ts">
import { ref } from 'vue'
import { runFunction } from './lib/run'
import { formatError } from './utils'
import CodeEditor from './codemirror/CodeEditor.vue'
const testFn = `export default function test(value) {
  console.log('test')
  return value + 1
}`
const result = ref()
const code = ref<string>(testFn)
const errorMessage = ref<string>()
async function test() {
  try {
    const res = await runFunction(code.value, [1])
    result.value = res
    return res
  } catch (e) {
    errorMessage.value = formatError(e)
  }
}
</script>

<template>
  <div>dsqdsq {{ result }} {{ code }}</div>
  <div>
    Error:
    <pre>{{ errorMessage }}</pre>
  </div>
  <button @click="test">Click</button>
  <CodeEditor mode="js" filename="test" v-model="code" />
</template>

<style scoped></style>
