import { Router } from 'express'
import { authController } from '../controllers'
import requireAuth from '../middlewares/requireAuth'

const authRouter = Router()

authRouter.get('/', authController.listUsers)
authRouter.post('/register', requireAuth(), authController.register)

export default authRouter
