import admin from 'firebase-admin'
import env from '../config/env.config'
import { Err } from 'http-staror'

admin.initializeApp({
  credential: admin.credential.cert(env.SERVICE_ACCOUNT),
})

export const verifyIdToken = async (token: string) =>
  await admin.auth().verifyIdToken(token)

export const listUsers = async () => await admin.auth().listUsers()

export const setCustomUserClaims = async (
  uid: string,
  prop: Record<string, unknown>
) => {
  try {
    await admin.auth().setCustomUserClaims(uid, prop)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    throw Err.setStatus('InternalServerError').setMessage("Couldn't set claims")
  }
}
