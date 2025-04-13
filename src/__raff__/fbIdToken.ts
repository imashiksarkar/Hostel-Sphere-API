import { verifyIdToken } from '../services/firebase.service'
import admin from 'firebase-admin'

const run = () => {
  verifyIdToken(
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjgxYjUyMjFlN2E1ZGUwZTVhZjQ5N2UzNzVhNzRiMDZkODJiYTc4OGIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2luZS12ZXJzZS1mNTllMyIsImF1ZCI6ImNpbmUtdmVyc2UtZjU5ZTMiLCJhdXRoX3RpbWUiOjE3Mzc5NDM2NTcsInVzZXJfaWQiOiJkTFhMdTFUY1BWWFVBYm1SOXBhdnJqTFdtWUIyIiwic3ViIjoiZExYTHUxVGNQVlhVQWJtUjlwYXZyakxXbVlCMiIsImlhdCI6MTczNzk0MzY1NywiZXhwIjoxNzM3OTQ3MjU3LCJlbWFpbCI6ImFhYUBtbS5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYWFhQG1tLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.U3Hu4pCJlCYb2ylCEgx_9Q5iru4kUl2NiRQ3IYIP-cRz6O44dcDi2GazulbEKViWeNwqZmHjllJhpWH03hCyGyj5-YC4GuJUHXo2FIhBCyVplNrxdtC_OwUb-zYeWPwKmYFQa7gOO-_CY5cdfUF1Ud4rfDrOfbJoF7vQzdYPfmE4WrLiXZJ_JVDaCK_xVlQmT85e4zN1PnnGPV9abMH4loemFat1UOX1waYwymckt7BFkv-2K3qnSjCtQF63TajDj_frk8BqaOv063ygZeIJEM22pS8tEba-dcJBUSCePh4NiP4_kWthqgdbYSUmR_2hmFlt9gWNKm5uYMjdPtaJTw'
  )
    .then(async (res) => {
      const userRecord = await admin.auth().getUser(res.uid)
      console.log('User displayName:', userRecord.displayName)
      console.log(res)
    })
    .catch((err) => console.log(err))
}

run()

// decode base64

// console.log();

process.exit(0)