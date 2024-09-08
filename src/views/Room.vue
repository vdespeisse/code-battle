<script setup lang="ts">
import useState from '../composables/state'
import CodeEditor from '../codemirror/CodeEditor.vue'
import SplitPane from '../components/SplitPane.vue'
import Panel from '../components/Panel.vue'
import Header from '../components/Header.vue'
import VueModal from '../components/VueModal.vue'
import CountdownTimer from '../components/CountdownTimer.vue'
import { useRoute } from 'vue-router'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
import { onMounted, ref, watch } from 'vue'
import { bindRoom, joinRoom, waitForBinding } from '../plugins/firebase'
const { state, actions } = useState()
const route = useRoute()
const room = bindRoom(route.params.roomId as string)
// state.description = `# Hello
// This is a test
// ## Test
// `
// state.tests = [
//   { input: [1, 2], output: 2 },
//   { input: [1, 2, 3], output: 3 },
//   { input: [1, 2, 3, 4], output: 4 },
//   { input: [1, 2, 3, 4, 5], output: 5 },
//   { input: [1], output: 1 },
// ]
watch(room, () => {
  if (!room.value) return
  actions.updateRoom(room.value)

  if (room.value.state === 'running' && state.roomState === 'setup') {
    actions.setScenario(route.params.roomId)
    state.timer = room.value.timer || 600
    state.startedAt = room.value.startedAt
    startRoom(state.timer!, state.startedAt!)
  } else {
    state.roomState = room.value.state
  }
})
function formatMilliseconds(ms: number) {
  if (!ms) return '00:00'
  const minutes = `${Math.floor(ms / 60000)}`.padStart(2, '0')
  const seconds = ((ms % 60000) / 1000).toFixed(0).padStart(2, '0')
  return `${minutes}:${seconds}`
}

function startRoom(timer: number, startedAt: number) {
  // Room starts 5 second after startAt, to ensure everyone got the responce
  const endTime = startedAt + timer * 1000 + 5000
  const interval = setInterval(() => {
    const now = new Date().getTime()
    const timeLeft = endTime - now
    if (state.roomState === 'closed') {
      clearInterval(interval)
      return
    }
    if (timeLeft < 0) {
      state.roomState = 'closed'
      clearInterval(interval)
      return
    } else if (state.roomState === 'setup' && timeLeft <= timer * 1000 + 3000 && timeLeft > timer * 1000) {
      state.roomState = 'starting'
      setTimeout(() => {
        state.roomState = 'running'
      }, 3000)
    } else {
      state.roomState = 'running'
    }
    // console.log('??sq', state.timeRemaining)

    state.timeRemaining = timeLeft
    // console.log('??', state.timeRemaining)
  }, 1000)
}
onMounted(async () => {
  state.roomState === 'loading'
  // await waitForBinding(room)
  if (!route.params.roomId) return
  state.roomState = 'setup'
  joinRoom(route.params.roomId as string)
  // actions.setScenario(route.params.roomId)
})
</script>

<template>
  <!-- <div>dsqdsq {{ result }} {{ code }}</div>
  <div>
    Error:
    <pre>{{ errorMessage }}</pre>
  </div> -->
  <Header @click="state.activePanel = null">
    <template #left>
      <div class="flex flex-row items-center gap-4">
        <fa-icon :icon="['far', 'clock']"></fa-icon>
        <div class="font-bold text-green-600">{{ formatMilliseconds(state.timeRemaining!) }}</div>
      </div>
    </template>
    <button
      class="flex flex-row font-bold items-center gap-4 py-2 px-4 rounded text-green-600 bg-green-400 bg-opacity-10 hover:bg-opacity-30"
      @click="actions.run"
    >
      <div>Run</div>
      <fa-icon :icon="['fas', 'play']" />
    </button>
  </Header>
  <VueModal v-if="['closed', 'setup', 'starting'].includes(state.roomState)">
    <div v-if="state.roomState === 'closed'" class="flex flex-col items-center gap-4 p-6">
      <div class="text-xl"> {{ state.status === 'pass' ? 'Congratulations!' : 'This challenge is over' }}</div>
      <div>Rankings</div>
      <ol class="list-decimal">
        <li v-for="winner in room?.winners" :key="winner.id">{{ winner.username }}</li>
      </ol>
    </div>
    <div v-else-if="state.roomState === 'setup'" class="flex flex-col items-center gap-4 p-6">
      <div class="text-center text-xl">Waiting for challenge to start</div>
      <div>Participants</div>
      <div v-for="participant in room?.participants" :key="participant.id" class="font-bold text-green-600">{{ participant.username }}</div>
    </div>
    <div v-else-if="state.roomState === 'starting'">
      <div class="flex flex-col items-center gap-4 p-6">
        <div class="text-center text-xl">Starting</div>
        <CountdownTimer></CountdownTimer>
      </div>
    </div>
  </VueModal>
  <SplitPane class="screen-height w-full bg-layer-0 p-4" layout="horizontal" :start-ratio="30" @click="state.activePanel = null">
    <template #left>
      <Panel :active="state.activePanel === 'description'" @click.stop="state.activePanel = 'description'" class="h-full">
        <template #header>
          <fa-icon :icon="['fas', 'book']"></fa-icon>
          <span>Description</span>
        </template>
        <MarkdownRenderer class="p-2" :markdown="state.description" v-if="state.roomState === 'running'"></MarkdownRenderer>
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
            <CodeEditor
              class="rounded border border-layer-1"
              mode="javascript"
              filename="test"
              v-model="state.code"
              :key="state.scenarioId"
            />
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
              <!-- <div>{{ state.roomState }}</div> -->
            </div>
          </Panel>
        </template>
      </SplitPane>
      <!-- <div>Right</div> -->
    </template>
  </SplitPane>
</template>

<style scoped></style>
