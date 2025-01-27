import { Request, Response } from 'express'
import catchAsync from '../lib/utils/catchAsync'
import AuthService from '../services/auth.service'
import IAuthService from '../types/AuthService.types'
import { createUserDto } from '../dtos/user.dto'
import { Err } from 'http-staror'
import { ReqWithUser } from '../middlewares/requireAuth'

class AuthController {
  constructor(private authService: IAuthService) {}

  login = catchAsync((_req: Request, res: Response) => {
    res.status(200).json({
      message: 'Welcome to the Hostel Sphere API 🚀',
    })
  })

  register = catchAsync(async (req: ReqWithUser, res: Response) => {
    const { success, data, error } = createUserDto.safeParse(req.locals.user)

    if (!success)
      throw Err.setStatus('BadRequest').setMessage(JSON.stringify(error))

    const user = await this.authService.createUser(data)

    res.status(201).json({
      status: 'success',
      data: user,
    })
  })
}

const authService = new AuthService()
const authController = new AuthController(authService)

export default authController
