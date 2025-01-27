import { Router } from 'express'
import { authController } from '../controllers'
import requireAuth from '../middlewares/requireAuth'
import requireRole from '../middlewares/requireRole'

const authRouter = Router()

authRouter.get('/', authController.listUsers)
authRouter.patch(
  '/',
  requireAuth(),
  requireRole('admin'),
  authController.changeUserRole
)
authRouter.post(
  '/register',
  requireAuth(),

  authController.register
)

export default authRouter
