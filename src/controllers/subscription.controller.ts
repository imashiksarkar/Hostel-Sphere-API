import { Response, Request } from 'express'
import { Err } from 'http-staror'
import mongoose from 'mongoose'
import { createSubscriptionDto } from '../dtos/subscription.dto'
import catchAsync from '../lib/utils/catchAsync'
import { ReqWithUser } from '../middlewares/requireAuth'
import SubscriptionService from '../services/subscription.service'
import ISubscriptionService, {
  IPaymentSuccess,
  IPlanEnum,
} from '../types/Subscription.types'

class SubscriptionController {
  constructor(private authService: ISubscriptionService) {}

  getPaymentHistory = catchAsync(async (req: ReqWithUser, res: Response) => {
    const userId = req.locals.user.fbId
    const history = await this.authService.getPaymentHistory(userId)
    return res.status(200).json({
      success: true,
      status: 'OK',
      data: history,
    })
  })

  createPaymentIntent = catchAsync(async (req: ReqWithUser, res: Response) => {
    const body = createSubscriptionDto(req.body)
    const userId = req.locals.user.fbId

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

  webhook = catchAsync(async (req: Request, res: Response) => {
    const { id, api_version, created, data, type } = req.body as IPaymentSuccess

    try {
      if (type === 'payment_intent.succeeded')
        await this.authService.savePaymentHistory({
          apiVersion: api_version,
          paymentId: id,
          paymentMethod: data?.object?.payment_method,
          price: data?.object?.amount_received,
          expiresAt: new Date(
            new Date().setMonth(new Date().getMonth() + 1)
          ).toISOString(),
          created,
          currency: data?.object?.currency,
          type,
          plan: data?.object?.metadata?.plan,
          userId: data?.object?.metadata?.userId,
        })

      return res.sendStatus(200)
    } catch (error) {
      console.log(error)

      if (error instanceof Err) throw error
      throw Err.setStatus('InternalServerError').setMessage(
        (error as Error).message
      )
    }
  })
}

const paymentController = new SubscriptionController(new SubscriptionService())

export default paymentController
