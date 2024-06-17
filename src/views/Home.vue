<script setup lang="ts">
import { ref } from 'vue'
import useState from '../composables/state'
import CodeEditor from '../codemirror/CodeEditor.vue'
import SplitPane from '../components/SplitPane.vue'
import Panel from '../components/Panel.vue'
import Header from '../components/Header.vue'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
const { state, actions } = useState()
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
  <Header @click="state.activePanel = null"></Header>
  <!-- <div>{{ state.code }}</div> -->
  <SplitPane class="screen-height w-full bg-layer-0 p-4" layout="horizontal" :start-ratio="30" @click="state.activePanel = null">
    <template #left>
      <Panel :active="state.activePanel === 'description'" @click.stop="state.activePanel = 'description'" class="h-full">
        <template #header>
          <fa-icon :icon="['far', 'lightbulb']"></fa-icon>
          <span>Description</span>
        </template>
        <MarkdownRenderer class="p-2" :markdown="state.description"></MarkdownRenderer>
      </Panel>
    </template>
    <template #right>
      <SplitPane class="h-full w-full" layout="vertical" :start-ratio="70">
        <template #left>
          <Panel :active="state.activePanel === 'editor'" @click.stop="state.activePanel = 'editor'" class="h-full">
            <template #header>
              <fa-icon :icon="['fas', 'code']"></fa-icon>
              <span>Editor</span>
            </template>
            <CodeEditor class="rounded border border-layer-1" mode="js" filename="test" v-model="state.code" />
          </Panel>
        </template>
        <template #right>
          <Panel :active="state.activePanel === 'terminal'" @click.stop="state.activePanel = 'terminal'" class="h-full">
            <template #header>
              <div class="flex flex-row items-center justify-between flex-1">
                <div class="flex flex-row items-center gap-2">
                  <fa-icon :icon="['fas', 'terminal']"></fa-icon>
                  <span>Terminal</span>
                  <button
                    class="flex flex-row font-bold items-center gap-2 py-1 px-2 rounded text-green-600 bg-green-400 bg-opacity-10 hover:bg-opacity-30"
                    @click="actions.run"
                  >
                    <div>Run</div>
                    <fa-icon :icon="['fas', 'play']" />
                  </button>
                </div>
                <div v-if="state.tests">Best result: {{ state.bestScore }}/{{ state.tests.length }}</div>
              </div>
            </template>
            <div v-html="state.terminal" class="h-full overflow-scroll font-mono p-2"></div>
            <div>
              <!-- <div>{{ state.status }}</div> -->
            </div>
          </Panel>
        </template>
      </SplitPane>
      <!-- <div>Right</div> -->
    </template>
  </SplitPane>
</template>

<style scoped></style>
