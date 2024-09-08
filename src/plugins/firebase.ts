import type { App, Plugin, Ref } from 'vue'
import { watch, ref } from 'vue'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import type { Scenario } from '../types'
import { useDocument, getCurrentUser, useCurrentUser } from 'vuefire'

export const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // storageBucket: "code-battles-10697.appspot.com",
  // messagingSenderId: "632897317470",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
})

// used for the firestore refs
export const db = getFirestore(firebaseApp)

// here we can export reusable database references
export const scenariosRef = collection(db, 'scenarios')

export async function getRoomScenario(roomId: string): Promise<Scenario> {
  const roomRef = doc(db, 'rooms', roomId)
  const roomSnap = await getDoc(roomRef)
  if (!roomSnap.exists()) {
    throw new Error('Room not found')
  }
  const scenarioRef = roomSnap.data().scenario
  const scenarioSnap = await getDoc(scenarioRef)
  return scenarioSnap.data() as Scenario
}
export function bindRoom(roomId: string) {
  return useDocument(doc(db, 'rooms', roomId))
}
export async function waitForBinding(refObject: Ref<any>) {
  return new Promise(resolve => {
    const stop = watch(
      refObject,
      value => {
        if (value) {
          stop()
          resolve(value)
        }
      },
      { immediate: true },
    )
  })
}
export async function joinRoom(roomId: string) {
  const roomRef = doc(db, 'rooms', roomId)
  const roomSnap = await getDoc(roomRef)
  if (!roomSnap.exists()) {
    throw new Error('Room not found')
  }
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('User no active user')
  }
  const participants = roomSnap.data().participants || []
  if (!participants.find(d => d.id === user.uid)) {
    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) {
      throw new Error('User not found')
    }
    const { username, roomId } = userSnap.data()
    if (roomId) {
      await leaveRoom(roomId, user.uid)
    }
    await updateDoc(roomRef, {
      participants: [...participants, { id: user.uid, username }],
    })
    updateDoc(userRef, {
      roomId,
    })
  }
}

export async function leaveRoom(roomId: string, userId: string) {
  const roomRef = doc(db, 'rooms', roomId)
  const roomSnap = await getDoc(roomRef)
  if (!roomSnap.exists()) {
    throw new Error('Room not found')
  }
  const participants = roomSnap.data().participants || []
  await updateDoc(roomRef, {
    participants: participants.filter(p => p.id !== userId),
  })
}
export const user = ref()

export default {
  install: (app: App) => {
    const authUser = useCurrentUser()
    watch(
      authUser,
      async value => {
        if (value && value.uid !== user.value?.id) {
          const userRef = doc(db, 'users', value.uid)
          const userSnap = await getDoc(userRef)
          if (!userSnap.exists()) {
            throw new Error('User not found')
          }
          user.value = userSnap.data()
        } else {
          user.value = null
        }
      },
      { immediate: true },
    )

    app.config.globalProperties.$db = db
  },
} as Plugin
