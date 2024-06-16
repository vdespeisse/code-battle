<script setup lang="ts">
import { ref } from 'vue'
import { formatError } from '../utils'
import useState from '../composables/state'
import CodeEditor from '../codemirror/CodeEditor.vue'
import SplitPane from '../components/SplitPane.vue'
import Header from '../components/Header.vue'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
const { state } = useState()
const testFn = `export default function test(value) {
  console.log('test')
  return value + 1
}`
const result = ref()
state.code = testFn
const errorMessage = ref<string>()
const editorElement = ref()

state.description = `# Hello
This is a test
## Test
`
state.tests = [
  { input: [1, 2], output: 2 },
  { input: [1, 2, 3], output: 3 },
  { input: [1, 2, 3, 4], output: 4 },
  { input: [1, 2, 3, 4, 5], output: 5 },
  { input: [1], output: 1 },
]
</script>

<template>
  <!-- <div>dsqdsq {{ result }} {{ code }}</div>
  <div>
    Error:
    <pre>{{ errorMessage }}</pre>
  </div> -->
  <Header></Header>
  <!-- <div>{{ state.code }}</div> -->
  <SplitPane class="screen-height w-full bg-layer-0 p-4" layout="horizontal" :start-ratio="30">
    <template #left>
      <MarkdownRenderer class="p-2 bg-layer-1 h-full rounded" :markdown="state.description"></MarkdownRenderer>
    </template>
    <template #right>
      <SplitPane class="h-full w-full" layout="vertical" :start-ratio="70">
        <template #left>
          <CodeEditor class="h-full rounded border border-layer-1" mode="js" filename="test" v-model="state.code" />
        </template>
        <template #right>
          <div class="h-full rounded bg-layer-1 border border-layer-1">
            <div>{{ state.status }}</div>
            <div v-html="state.terminal"></div>
          </div>
        </template>
      </SplitPane>
      <!-- <div>Right</div> -->
    </template>
  </SplitPane>
</template>

<style scoped></style>
