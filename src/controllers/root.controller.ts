import { Request, Response } from 'express'
import catchAsync from '../lib/utils/catchAsync'

class RootController {
  root = catchAsync(async (_req: Request, res: Response) => {
    res.status(200).json({
      message: 'Welcome to the Hostel Sphere API 🚀',
    })
  })
}

const rootController = new RootController()

export default rootController
