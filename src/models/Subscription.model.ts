import { Document, model, Model, Schema } from 'mongoose'
import subscriptionEnum from '../constants/subscription'
import {
  CreateSubscriptionDto,
  ISubscription,
} from '../types/Subscription.types'

type SubscriptionDocument = Document & ISubscription
type SubscriptionModel = Model<ISubscription>

const SubscriptionSchema = new Schema<SubscriptionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId as unknown as StringConstructor,
      required: true,
      ref: 'User',
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
      type: Date,
      default: new Date(new Date().setMonth(new Date().getMonth() + 1)),
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
