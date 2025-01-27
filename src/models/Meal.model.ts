import { model, Schema, Document, Model } from 'mongoose'
import IMeal, { CreateMealDto } from '../types/Meal.types'
import mealStatuses from '../constants/mealStatuses'
import categories from '../constants/categories'

type MealDocument = Document & IMeal
type MealModel = Model<IMeal>

const MealSchema = new Schema<MealDocument>(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Title is required.'],
    },
    image: {
      type: String,
      trim: true,
      required: [true, 'Image is required.'],
    },
    price: {
      type: Number,
      min: 10,
      required: [true, 'Price is required.'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Description is required.'],
    },
    status: {
      type: String,
      enum: mealStatuses,
      default: 'available',
    },
    category: {
      type: String,
      enum: categories,
      default: 'breakfast',
    },
    distributor: {
      type: String,
      trim: true,
      required: [true, 'Distributor is required.'],
    },
    ingredients: {
      type: [String],
      required: [true, 'Ingredients are required.'],
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

const MealModel = model<MealDocument, MealModel>('Meal', MealSchema)

export default class Meal extends MealModel {
  constructor(private input: CreateMealDto) {
    super(input)
  }
}
