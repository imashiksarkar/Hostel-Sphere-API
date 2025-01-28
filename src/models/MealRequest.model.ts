import { Document, model, Model, Schema } from 'mongoose'
import { ICreateMealRequestDto, IMealRequest } from '../types/Meal.types'
import mealReqStatuses from '../constants/mealReqStatuses'

type MealReqDocument = Document & IMealRequest
type MealReqModel = Model<IMealRequest>

const MealReqSchema = new Schema<MealReqDocument>(
  {
    meal: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Meal',
    },
    requestor: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      enum: mealReqStatuses,
      default: 'pending',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

const ModelDumb = model<MealReqDocument, MealReqModel>('MealReq', MealReqSchema)

export default class MealReq extends ModelDumb {
  constructor(private input: ICreateMealRequestDto) {
    super(input)
  }
}
