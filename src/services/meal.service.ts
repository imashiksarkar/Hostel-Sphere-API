import Meal from '../models/Meal.model'
import { CreateMealDto } from '../types/Meal.types'
import IMealService from '../types/MealService.types'

export default class MealService implements IMealService {
  create = async (meal: CreateMealDto) => {
    const newMeal = new Meal(meal)
    return await newMeal.save()
  }
}
