import IMeal, { CreateMealDto } from './Meal.types'

export default interface IMealService {
  create: (meal: CreateMealDto) => Promise<IMeal>
  fetchMeals: (
    category?: string,
    sort?: string,
    skip?: number,
    limit?: number
  ) => Promise<{ totalDocs: number; meals: IMeal[] }>
}
