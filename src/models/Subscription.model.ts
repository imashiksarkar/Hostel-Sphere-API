import { Document, model, Model, Schema } from 'mongoose'
import subscriptionEnum from '../constants/subscription'
import {
  CreateSubscriptionDto,
  ISubscription,
} from '../types/Subscription.types'

type SubscriptionDocument = Document & ISubscription
type SubscriptionModel = Model<SubscriptionDocument>

const SubscriptionSchema = new Schema<SubscriptionDocument>(
  {
    userId: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      enum: subscriptionEnum,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    expiresAt: {
      type: String,
      default: new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      ).toDateString(),
    },
    apiVersion: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    created: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

const UnTypedModel = model<SubscriptionDocument, SubscriptionModel>(
  'Subscription',
  SubscriptionSchema
)

export default class Subscription extends UnTypedModel {
  constructor(private input: CreateSubscriptionDto) {
    super(input)
  }
}
