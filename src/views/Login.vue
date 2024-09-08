<script setup lang="ts">
import { ref } from 'vue'
import { signInAnonymously, signOut } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { getCurrentUser, useFirebaseAuth, useFirestore } from 'vuefire'
import MatrixModal from '../components/MatrixModal.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const auth = useFirebaseAuth()!
const state = ref<'idle' | 'loading' | 'error'>('idle')
const username = ref('')
const error = ref('')
const db = useFirestore()
async function login() {
  if (!username.value) return
  state.value = 'loading'
  const currentUser = await getCurrentUser()
  let userId: string
  if (currentUser) {
    userId = currentUser.uid
  } else {
    const signinResponse = await signInAnonymously(auth).catch(reason => {
      console.error('Failed signin', reason)
      error.value = reason
    })
    userId = signinResponse?.user.uid!
  }
  const userDoc = doc(db, 'users', userId)
  await setDoc(userDoc, { userId, username: username.value }).catch(reason => {
    console.error('Failed to create user', reason)
    error.value = reason
  })
  state.value = 'idle'
  router.push((route.query?.redirect as string) || '/')
}
</script>
<template>
  <MatrixModal>
    <form class="login-box p-8 flex flex-col items-center gap-8">
      <fieldset class="flex flex-col gap-4">
        <label for="username" class="text-center">Choose an username</label>
        <input v-model="username" class="bg-layer-2 rounded p-4" type="text" id="username" name="username" />
      </fieldset>
      <!-- <fieldset class="flex flex-col gap-2">
        <label for="password">Password</label>
        <input class="bg-slate-900 rounded p-4" type="password" id="password" name="password" />
      </fieldset> -->
      <button @click.prevent="login" class="py-2 px-4 font-bold rounded w-40 text-green-600 bg-green-400 bg-opacity-10 hover:bg-opacity-30">
        {{ state === 'loading' ? 'Loading...' : 'Start' }}
      </button>
    </form>
  </MatrixModal>
</template>
<style scoped>
.login-box input {
  /* background: var(--background); */
  border-radius: 8px;
  height: 40px;
  padding: 10px 16px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.login-box input:hover,
.login-box input:focus {
  /* background: white; */
  border-color: rgba(0, 0, 0, 0.14);
  box-shadow: 0 0 0 3px rgb(22, 163, 74, 0.4);
}
.login-box input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgb(22, 163, 74, 1);
}
</style>
