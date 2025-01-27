import { Router } from 'express'
import {
  healthController,
  notFoundController,
  rootController,
  authController,
} from '../controllers'
import requireAuth from '../middlewares/requireAuth'

const router = Router()

router.get('/', rootController.root)

router.post('/auth/register', requireAuth(), authController.register)
// router.get('/auth/register', rootController.root)

router.get('/health', healthController.healthCheck)

router.all('/*', notFoundController.notFound)

export default router
