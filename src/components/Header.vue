<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useCurrentUser, useFirestore } from 'vuefire'
import { doc, getDoc } from 'firebase/firestore'
// import useState from '../composables/state'
const user = useCurrentUser()
const db = useFirestore()
const username = ref(' ')
watchEffect(async () => {
  if (!user.value) return
  const userDoc = await getDoc(doc(db, 'users', user.value.uid))
  username.value = userDoc?.data()?.username
})
</script>
<template>
  <div class="flex flex-row items-center justify-between nav-height p-4">
    <div>
      <slot name="left"></slot>
    </div>
    <div>
      <slot></slot>
    </div>
    <div class="flex flex-row items-center gap-2">
      <div class="font-bold">{{ username }}</div>
      <fa-icon :icon="['fas', 'gear']"></fa-icon>
    </div>
  </div>
</template>

<style scoped></style>
