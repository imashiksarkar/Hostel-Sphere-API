import { Response } from 'express'
import { ReqWithUser } from '../middlewares/requireAuth'
import SubscriptionService from '../services/subscription.service'
import ISubscriptionService, { IPlanEnum } from '../types/Subscription.types'
import catchAsync from '../lib/utils/catchAsync'
import { createSubscriptionDto } from '../dtos/subscription.dto'
import { Err } from 'http-staror'
import isValidObjectId from '../lib/utils/objectIdType'
import mongoose from 'mongoose'

class SubscriptionController {
  constructor(private authService: ISubscriptionService) {}

  createPaymentIntent = catchAsync(async (req: ReqWithUser, res: Response) => {
    const body = createSubscriptionDto(req.body)
    const userId = isValidObjectId(req.locals.user._id)

    try {
      const Plan = mongoose.connection.db?.collection('plans')
      const plan = await Plan?.find({ name: body.plan }).toArray()

      if (plan?.length === 0)
        throw Err.setStatus('NotFound').setMessage('Plan not found')

      const { name, price } = plan?.[0] as unknown as {
        price: number
        name: IPlanEnum
      }

      const paymentIntent = await this.authService.createPaymentIntent({
        userId,
        plan: name,
        price,
      })
      return res.status(201).json({
        success: true,
        status: 'Created',
        data: {
          clientSecret: paymentIntent.client_secret,
        },
      })
    } catch (err) {
      if (err instanceof Err) throw err
      throw Err.setStatus('InternalServerError').setMessage(
        (err as Error).message
      )
    }
  })
}

const paymentController = new SubscriptionController(new SubscriptionService())

export default paymentController
