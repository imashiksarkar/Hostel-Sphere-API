import { Router } from 'express'
import requireAuth from '../middlewares/requireAuth'
import requireRole from '../middlewares/requireRole'
import { subscriptionController } from '../controllers'

const paymentRouter = Router()

paymentRouter.post(
  '/',
  requireAuth(),
  requireRole('user'),
  subscriptionController.createPaymentIntent
)

export default paymentRouter
