import { Router } from 'express'
import {
  healthController,
  notFoundController,
  rootController,
} from '../controllers'
import authRouter from './auth.routes'
import mealRouter from './meal.routes'
import likeRouter from './like.routes'

const router = Router()

router.get('/', rootController.root)
router.use('/users', authRouter)
router.use('/meals', mealRouter)
router.use('/likes', likeRouter)
router.get('/health', healthController.healthCheck)
router.all('/*', notFoundController.notFound)

export default router
