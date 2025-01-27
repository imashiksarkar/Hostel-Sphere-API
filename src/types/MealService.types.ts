import IMeal, { CreateMealDto } from './Meal.types'

export default interface IMealService {
  create: (meal: CreateMealDto) => Promise<IMeal>
}
