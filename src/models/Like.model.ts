import { Document, model, Model, Schema } from 'mongoose'
import ILike, { CreateLikeDto } from '../types/Like.types'

type LikeDocument = Document & ILike
type LikeModel = Model<ILike>

const LikeSchema = new Schema<LikeDocument>(
  {
    liker: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    meal: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Meal',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

const LikeModel = model<LikeDocument, LikeModel>('Like', LikeSchema)

export default class Like extends LikeModel {
  constructor(private input: CreateLikeDto) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(input as any)
  }
}
