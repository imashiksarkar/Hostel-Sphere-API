import { Err } from 'http-staror'
import Stripe from 'stripe'
import env from '../config/env.config'
import Subscription from '../models/Subscription.model'
import ISubscriptionService, {
  CreatePaymentIntentDto,
  ISubscription,
  ISubscriptionInput,
} from '../types/Subscription.types'

const stripe = new Stripe(env.STRIPE_API_SECRET_KEY)

export default class SubscriptionService implements ISubscriptionService {
  createPaymentIntent = async (input: CreatePaymentIntentDto) => {
    const { plan, price, userId } = input

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000 * price,
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },

        metadata: {
          plan,
          userId,
        },
      })

      return paymentIntent
    } catch (error) {
      throw Err.setStatus('InternalServerError').setMessage(
        (error as Error).message
      )
    }
  }

  savePaymentHistory = async (input: ISubscriptionInput) => {
    const {
      plan,
      price,
      userId,
      created,
      expiresAt,
      apiVersion,
      currency,
      paymentId,
      paymentMethod,
      type,
    } = input

    try {
      return (await Subscription.updateOne(
        { paymentId },
        {
          apiVersion,
          userId,
          plan,
          price,
          currency,
          paymentMethod,
          type,
          created,
          expiresAt,
        },
        {
          upsert: true,
        }
      )) as unknown as ISubscription
    } catch (error) {
      throw Err.setStatus('InternalServerError').setMessage(
        (error as Error).message
      )
    }
  }

  getPaymentHistory = async (userId: string) => {
    try {
      const history = await Subscription.find({ userId }).lean()

      return history
    } catch (error) {
      throw Err.setStatus('InternalServerError').setMessage(
        (error as Error).message
      )
    }
  }
}
