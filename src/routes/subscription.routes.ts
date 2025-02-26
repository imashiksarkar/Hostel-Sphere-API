import { Router } from 'express'
import requireAuth from '../middlewares/requireAuth'
import requireRole from '../middlewares/requireRole'
import { subscriptionController } from '../controllers'

const paymentRouter = Router()

paymentRouter.get(
  '/',
  requireAuth(),
  requireRole('user'),
  subscriptionController.getPaymentHistory
)

paymentRouter.post(
  '/',
  requireAuth(),
  requireRole('user'),
  subscriptionController.createPaymentIntent
)

paymentRouter.post('/webhook', subscriptionController.webhook)

export default paymentRouter
