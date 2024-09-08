<script setup lang="ts">
import Panel from '../../components/Panel.vue'
import Header from '../../components/Header.vue'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { bindRoom, db } from '../../plugins/firebase'
import { doc, updateDoc } from 'firebase/firestore'
const route = useRoute()
const room = bindRoom(route.params.roomId as string)
async function setTimer(event: Event) {
  const target = event.target as HTMLInputElement
  const timer = parseInt(target.value)
  const docRef = doc(db, 'rooms', route.params.roomId as string)
  await updateDoc(docRef, { timer })
}
async function startRoom() {
  const docRef = doc(db, 'rooms', route.params.roomId as string)
  await updateDoc(docRef, { state: 'running', startedAt: new Date().getTime() })
}
</script>
<template>
  <Header></Header>
  <div class="flex flex-row screen-height gap-4" v-if="room">
    <Panel class="w-full">
      <template #header>
        <span>Participants</span>
      </template>
      <div v-for="participant in room.participants" :key="participant.id">
        {{ participant.username }}
      </div>
    </Panel>
    <Panel>
      <template #header>
        <span>Setup</span>
      </template>
      <div class="p-4 flex flex-col gap-4">
        <fieldset class="flex flex-col gap-2">
          <label>Timer</label>
          <input class="input bg-layer-2 w-32" type="number" :value="room.timer" @change="setTimer" />
        </fieldset>
        <button class="green-button" @click="startRoom">Start</button>
        <div>{{ room }}</div>
      </div>
    </Panel>
  </div>
</template>
