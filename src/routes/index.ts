import { Router } from 'express'
import {
  healthController,
  notFoundController,
  rootController,
  authController,
} from '../controllers'
import requireAuth from '../middlewares/requireAuth'
import mealRouter from './meal.routes'

const router = Router()

router.get('/', rootController.root)

router.post('/auth/register', requireAuth(), authController.register)

router.use('/meals', mealRouter)

router.get('/health', healthController.healthCheck)

router.all('/*', notFoundController.notFound)

export default router
