import z from 'zod'
import { createMealDto } from '../dtos/meal.dto'
import mealStatuses from '../constants/mealStatuses'

export type CreateMealDto = z.infer<typeof createMealDto> & {
  distributor: string
}

type IMeal = Omit<CreateMealDto, 'status'> & {
  _id: string
  status: (typeof mealStatuses)[number] // default is 'available'
  rating: number // default is 0
  likes: number // aggregate
  reviews: number // aggregate
  createdAt: Date
  updatedAt: Date
}

export default IMeal
