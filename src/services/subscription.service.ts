import { Err } from 'http-staror'
import Stripe from 'stripe'
import env from '../config/env.config'
import ISubscriptionService, {
  ISubscriptionInput,
} from '../types/Subscription.types'

const stripe = new Stripe(env.STRIPE_API_SECRET_KEY)

export default class SubscriptionService implements ISubscriptionService {
  createPaymentIntent = async (input: ISubscriptionInput) => {
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
}
