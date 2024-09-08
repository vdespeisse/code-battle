<script setup lang="ts">
import { useCollection } from 'vuefire'
import { collection, setDoc, doc } from 'firebase/firestore'
import { db } from '../../plugins/firebase'
import type { Room } from '../../types'
import Header from '../../components/Header.vue'

const rooms = useCollection<Room>(collection(db, 'rooms'))
function createRoom() {
  const id = prompt('Enter room id')
  if (!id) return
  setDoc(doc(db, 'rooms', id), { id })
}
</script>
<template>
  <Header></Header>
  <div>{{ rooms[0] }}</div>
  <div v-if="!rooms || !rooms.length">Loading rooms...</div>
  <div class="flex flex-col p-8 gap-4" v-else>
    <div class="flex flex-row items-center justify-between">
      <input />
      <icon-button class="bg-layer-2 hover:bg-layer-4" :icon="['fas', 'plus']" @click="createRoom">Create new</icon-button>
    </div>
    <table class="w-full text-left rtl:text-right">
      <thead class="text-sm uppercase bg-layer-3">
        <tr>
          <th class="px-6 py-3">Id</th>
          <th class="px-6 py-3">Status</th>
          <th class="px-6 py-3">Scenario</th>
          <th class="px-6 py-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="room in rooms" :key="room.id" class="border-b bg-layer-2 border-layer-4">
          <th scope="row" class="px-6 py-4 font-medium whitespace-nowrap">{{ room.id }}</th>
          <td class="px-6 py-4">{{ room.status }}</td>
          <td class="px-6 py-4">{{ room.scenario?.name }}</td>
          <td class="px-6 py-4">
            <router-link :to="{ path: `room/${room.id}/admin` }">
              <icon-button :icon="['fas', 'pen-to-square']">Edit</icon-button>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
