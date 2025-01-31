import z from 'zod'
import { createMealDto, createMealReqDto } from '../dtos/meal.dto'
import mealStatuses from '../constants/mealStatuses'
import mealReqStatuses from '../constants/mealReqStatuses'

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

export type ICreateMealRequestDto = z.infer<typeof createMealReqDto>

export type MealReqStatus = (typeof mealReqStatuses)[number]

export interface IMealRequest extends ICreateMealRequestDto {
  _id: string
  status: MealReqStatus // default is 'pending'
  createdAt: Date
  updatedAt: Date
}
