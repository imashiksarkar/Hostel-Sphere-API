import Stripe from 'stripe'
import subscriptionEnum from '../constants/subscription'
import { createSubscriptionDto } from '../dtos/subscription.dto'

export type CreateSubscriptionDto = ReturnType<typeof createSubscriptionDto>

export type IPlanEnum = (typeof subscriptionEnum)[number]

export interface ISubscriptionInput {
  userId: string
  plan: IPlanEnum
  price: number
}

export interface ISubscription extends ISubscriptionInput {
  _id: string
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

export default interface ISubscriptionService {
  createPaymentIntent: (
    input: ISubscriptionInput
  ) => Promise<Stripe.Response<Stripe.PaymentIntent>>
}
