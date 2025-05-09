import { NextFunction, Request, Response } from 'express'
import { Err } from 'http-staror'
import catchAsync from '../lib/utils/catchAsync'
import { verifyIdToken } from '../services/firebase.service'
import admin from 'firebase-admin'

export interface IUser {
  _id: string
  fbId: string
  name: string
  email?: string
  image?: string
  role?: 'admin' | 'user'
}

export interface ReqWithUser<T extends 'passThrough' | unknown = unknown>
  extends Request {
  locals: {
    user: T extends 'passThrough' ? IUser | null : IUser
  }
}

const requireAuth = (passThrough = false) =>
  catchAsync(
    async (
      req: ReqWithUser<'passThrough'>,
      _res: Response,
      next: NextFunction
    ) => {
      const user = {} as IUser
      let error = null

      try {
        if (!req.headers?.authorization)
          throw Err.setStatus('Unauthorized').setMessage('No token provided')

        const token = req.headers.authorization.split(' ')[1]
        const { uid, name, email, picture, role, userId } = await verifyIdToken(
          token
        )

        user.fbId = uid
        user.name = name
        user.email = email
        user.image = picture
        user.role = role || 'user'
        user._id = userId

        if (!name) {
          const userRecord = await admin.auth().getUser(uid)
          user.name = userRecord.displayName!
          user.image = userRecord.photoURL
        }
      } catch (err: unknown) {
        error = err
      }

      req.locals = {
        user,
      }

      if (error && passThrough) return next()
      else if (error)
        throw Err.setStatus('Unauthorized').setMessage(JSON.stringify(error))

      return next()
    }
  )

export default requireAuth
