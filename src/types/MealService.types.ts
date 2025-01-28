import IMeal, { CreateMealDto } from './Meal.types'

export default interface IMealService {
  create: (meal: CreateMealDto) => Promise<IMeal>
  fetchMeals: (
    filter?: string,
    skip?: number,
    limit?: number
  ) => Promise<{ totalDocs: number; meals: IMeal[] }>
}
