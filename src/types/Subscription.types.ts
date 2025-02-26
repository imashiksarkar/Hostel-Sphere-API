import Stripe from 'stripe'
import subscriptionEnum from '../constants/subscription'
import { createSubscriptionDto } from '../dtos/subscription.dto'

export type CreateSubscriptionDto = ReturnType<typeof createSubscriptionDto>

export type IPlanEnum = (typeof subscriptionEnum)[number]

export interface ISubscriptionInput {
  userId: string
  plan: IPlanEnum
  price: number
  paymentId: string
  apiVersion: string
  created: number
  currency: string
  paymentMethod: string
  type: string
  expiresAt: string
}

export interface ISubscription extends ISubscriptionInput {
  _id: string
  createdAt: Date
  updatedAt: Date
}

export type CreatePaymentIntentDto = {
  userId: string
  plan: IPlanEnum
  price: number
}

export default interface ISubscriptionService {
  createPaymentIntent: (
    input: CreatePaymentIntentDto
  ) => Promise<Stripe.Response<Stripe.PaymentIntent>>

  savePaymentHistory: (input: ISubscriptionInput) => Promise<ISubscription>
}

export interface IPaymentSuccess {
  id: string
  api_version: string
  created: number
  amount_received: number
  currency: string
  payment_method: string
  type: string
  plan: IPlanEnum
  userId: string
  data: {
    object: {
      amount_received: number
      currency: string
      payment_method: string
      metadata: { plan: IPlanEnum; userId: string }
    }
  }
}
