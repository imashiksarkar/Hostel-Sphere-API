import z from 'zod'
import { createMealDto } from '../dtos/meal.dto'
import mealStatuses from '../constants/mealStatuses'

export type CreateMealDto = z.infer<typeof createMealDto> & {
  distributor: string
}

type IMeal = CreateMealDto & {
  _id: string
  status: (typeof mealStatuses)[number] // default is 'available'
  rating: number // default is 0
  createdAt: Date
  updatedAt: Date
}

export default IMeal
