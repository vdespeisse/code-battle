/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from 'firebase-functions/v2/https'
import * as logger from 'firebase-functions/logger'
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

initializeApp()
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const createAdminUser = onRequest(async (request, response) => {
  logger.info('Hello logs!', { structuredData: true })
  const email = request.query.email as string
  const password = request.query.password as string
  const username = request.query.username as string
  if (!email || !password) {
    response.status(400).send('Missing username or password')
    return
  }
  const auth = getAuth()
  const user = await auth.createUser({
    email,
    emailVerified: true,
    password,
  })
  auth.setCustomUserClaims(user.uid, { role: 'admin' })
  await getFirestore().collection('users').doc(user.uid).set({ email, username, role: 'admin' })
  response.send('User created')
})
