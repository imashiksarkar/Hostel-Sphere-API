import admin from 'firebase-admin'
import env from '../config/env.config'

admin.initializeApp({
  credential: admin.credential.cert(env.SERVICE_ACCOUNT),
})

export const verifyIdToken = async (token: string) =>
  await admin.auth().verifyIdToken(token)
