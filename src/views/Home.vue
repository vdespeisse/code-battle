<script setup lang="ts">
import { ref } from 'vue'
import { runFunction } from '../lib/run'
import { formatError } from '../utils'
import CodeEditor from '../codemirror/CodeEditor.vue'
import SplitPane from '../components/SplitPane.vue'
const testFn = `export default function test(value) {
  console.log('test')
  return value + 1
}`
const result = ref()
const code = ref<string>(testFn)
const errorMessage = ref<string>()
const editorElement = ref()
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
  <SplitPane class="h-screen w-full bg-layer-0" layout="horizontal">
    <template #left>
      <div class="h-full bg-layer-1 rounded border border-layer-1">Left</div>
    </template>
    <template #right>
      <SplitPane class="h-full w-full" layout="vertical">
        <template #left>
          <CodeEditor class="h-full rounded border border-layer-1" mode="js" filename="test" v-model="code" ref="editorElement" />
        </template>
        <template #right>
          <div class="h-full rounded bg-layer-1 border border-layer-1">Left</div>
        </template>
      </SplitPane>
      <!-- <div>Right</div> -->
    </template>
  </SplitPane>
  <button @click="test">Click</button>
</template>

<style scoped></style>
