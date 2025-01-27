import { Request, Response } from 'express'
import catchAsync from '../lib/utils/catchAsync'
import AuthService from '../services/auth.service'
import IAuthService from '../types/AuthService.types'
import { createUserDto } from '../dtos/user.dto'
import { Err } from 'http-staror'
import { ReqWithUser } from '../middlewares/requireAuth'

class AuthController {
  constructor(private authService: IAuthService) {}

  register = catchAsync(async (req: ReqWithUser, res: Response) => {
    const { success, data, error } = createUserDto.safeParse(req.locals.user)

    if (!success)
      throw Err.setStatus('BadRequest').setMessage(JSON.stringify(error))

    const user = await this.authService.createUser(data)

    res.status(201).json({
      success: true,
      status: 'CREATED',
      data: user,
    })
  })

  listUsers = catchAsync(async (req: Request, res: Response) => {
    const searchText = ((req.query.search || '') as string).trim()
    const skip = parseInt(req.query.skip as string) || 0

    const users = await this.authService.listUsers(searchText, skip)
    res.status(200).json({
      success: true,
      status: 'OK',
      data: users,
    })
  })
}

const authService = new AuthService()
const authController = new AuthController(authService)

export default authController
