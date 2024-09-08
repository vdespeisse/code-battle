<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from 'vue'
import { useCollection } from 'vuefire'
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore'
import { scenariosRef, db } from '../../plugins/firebase'
import type { Scenario } from '../../types'
import SplitPane from '../../components/SplitPane.vue'
import CodeEditor from '../../codemirror/CodeEditor.vue'
import Panel from '../../components/Panel.vue'
import Header from '../../components/Header.vue'
const state = reactive({
  step: 'description',
  description: '',
  tests: '',
  code: `export default function solution() {
  return
}`,
})
const scenarios = useCollection<Scenario>(scenariosRef)
const selectedScenario = ref<Scenario>()
const selectedScenarioId = ref<string>()
const activeScenario = ref<Scenario>()
const activeChanges = computed(() => {
  if (!activeScenario.value) return false
  return JSON.stringify(activeScenario.value) !== JSON.stringify(selectedScenario.value)
})
function selectScenario(scenarioName?: string) {
  const scenario = scenarios.value.find(scenario => scenario.id === scenarioName)
  if (!scenario) return
  if (selectedScenario.value && activeChanges.value) {
    const confirmChange = confirm('You have unsaved changes on the selected scenario. Do you want to discard them?')
    if (!confirmChange) {
      const curId = selectedScenarioId.value
      // FUck this
      nextTick(() => setTimeout(() => (selectedScenarioId.value = curId), 10))
      return
    }
  }
  selectedScenarioId.value = scenario.id
  selectedScenario.value = scenario
  activeScenario.value = JSON.parse(JSON.stringify(scenario))
}
async function createScenario() {
  const name = prompt('Enter scenario name')
  if (!name) return
  await addDoc(collection(db, 'scenarios'), { name })
  selectScenario(name)
}
// watch(selectedScenario, (newScenario, oldScenario) => {
//   if (oldScenario && activeChanges.value) {
//     const confirmChange = confirm('You have unsaved changes on the selected scenario. Do you want to discard them?')
//     if (!confirmChange) {
//       // debugger
//       nextTick(() => (selectedScenario.value = scenarios.value.find(scenario => scenario.id === oldScenario.id)))
//       return
//     }
//   }
//   activeScenario.value = JSON.parse(JSON.stringify(newScenario))
// })
async function save() {
  if (!activeScenario.value || !selectedScenarioId.value) return
  const docRef = doc(db, 'scenarios', selectedScenarioId.value)
  const { description, code, tests } = activeScenario.value
  await updateDoc(docRef, { description: description || '', code: code || '', tests: tests || '' })
}
</script>
<template>
  <Header>
    <button
      class="flex flex-row font-bold items-center gap-4 py-2 px-4 rounded text-green-600 bg-green-400 bg-opacity-10 hover:bg-opacity-30"
      @click="save"
    >
      <div>Save</div>
      <fa-icon :icon="['fas', 'floppy-disk']" />
    </button>
  </Header>
  <div>{{ state.step }}</div>
  <div>{{ activeScenario }}</div>
  <div>ac:{{ activeChanges }}</div>
  <SplitPane class="screen-height w-full bg-layer-0 p-4" layout="horizontal" :start-ratio="30" @click="state.activePanel = null">
    <template #left>
      <Panel class="h-full">
        <template #header>
          <fa-icon :icon="['fas', 'list']"></fa-icon>
          <span>Scenarios</span>
        </template>
        <div class="flex flex-col gap-2 p-6">
          <select
            v-model="selectedScenarioId"
            @input="ev => selectScenario((ev?.target as HTMLInputElement)?.value)"
            class="bg-layer-4 p-2 rounded active:ring-green-600"
          >
            <option></option>
            <option v-for="scenario in scenarios" :key="scenario.id" :value="scenario.id">
              {{ scenario.name }}
            </option>
          </select>
          <div class="flex flex-row items-center justify-end">
            <icon-button class="bg-layer-2 hover:bg-layer-4" :icon="['fas', 'plus']" @click="createScenario">Create new</icon-button>
          </div>
        </div>
      </Panel>
    </template>
    <template #right>
      <Panel class="h-full">
        <template #header>
          <button
            @click="state.step = 'description'"
            class="px-2 py-1 rounded font-bold flex flex-row gap-2 items-center"
            :class="state.step === 'description' ? 'bg-green-600 hover:bg-green-600' : 'bg-layer-3 hover:bg-layer-5'"
          >
            <fa-icon :icon="['fas', 'book']"></fa-icon>
            <span>Description</span>
          </button>
          <button
            @click="state.step = 'tests'"
            class="px-2 py-1 rounded font-bold flex flex-row gap-2 items-center"
            :class="state.step === 'tests' ? 'bg-green-600 hover:bg-green-600' : 'bg-layer-3 hover:bg-layer-5'"
          >
            <fa-icon :icon="['fas', 'flask-vial']"></fa-icon>
            <span>tests</span>
          </button>
          <button
            @click="state.step = 'code'"
            class="px-2 py-1 rounded font-bold flex flex-row gap-2 items-center"
            :class="state.step === 'code' ? 'bg-green-600 hover:bg-green-600' : 'bg-layer-3 hover:bg-layer-5'"
          >
            <fa-icon :icon="['fas', 'code']"></fa-icon>
            <span>Code</span>
          </button>
        </template>
        <template v-if="activeScenario">
          <CodeEditor
            class="rounded border border-layer-1"
            mode="markdown"
            v-model="activeScenario.description"
            v-if="state.step === 'description'"
            :key="selectedScenarioId"
          />
          <CodeEditor class="rounded border border-layer-1" mode="json" v-model="activeScenario.tests" v-if="state.step === 'tests'" />
          <CodeEditor class="rounded border border-layer-1" mode="javascript" v-model="activeScenario.code" v-if="state.step === 'code'" />
        </template>
      </Panel>
    </template>
  </SplitPane>
</template>
