import { Err } from 'http-staror'
import catchAsync from '../lib/utils/catchAsync'
import { ReqWithUser } from './requireAuth'
import { NextFunction, Response } from 'express'

const requireRole = (role: 'admin' | 'user') =>
  catchAsync(async (req: ReqWithUser, _res: Response, next: NextFunction) => {
    if (req.locals.user.role !== role) {
      throw Err.setStatus('Forbidden').setMessage('Not allowed')
    }

    next()
  })

export default requireRole
