import IMeal, { CreateMealDto } from './Meal.types'

export default interface IMealService {
  create: (meal: CreateMealDto) => Promise<IMeal>
  fetchMeals: (
    aggregation: QueryParams
  ) => Promise<{ totalDocs: number; meals: IMeal[] }>
  fetchMealById: (id: string) => Promise<IMeal>
}

export interface QueryParams {
  q?: string
  price?:
    | number
    | {
        $gte?: number
        $lte?: number
      }
  status?: 'upcoming' | 'available' | 'delivered'
  category?: 'breakfast' | 'lunch' | 'dinner'
  $sort?: Record<string, 1 | -1>
  $skip?: number
  $limit?: number
}
