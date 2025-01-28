import { Err } from 'http-staror'
import MealReq from '../models/MealRequest.model'
import { ICreateMealRequestDto } from '../types/Meal.types'
import IMealReqService from '../types/MealReqService.types'
import Meal from '../models/Meal.model'

export default class MealReqService implements IMealReqService {
  create = async (mealReqInput: ICreateMealRequestDto) => {
    try {
      const existingMeal = await Meal.findById(mealReqInput.meal)
      if (existingMeal?.status !== 'available')
        throw Err.setStatus('NotFound').setMessage('Meal is not available!')

      // check if the meal req is already created
      const existingMealReq = await MealReq.findOne({
        requestor: mealReqInput.requestor,
        meal: mealReqInput.meal,
      })
      if (existingMealReq && existingMealReq?.status === 'pending')
        throw Err.setStatus('Conflict').setMessage(
          'Meal request already exists!'
        )

      return await MealReq.create(mealReqInput)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      if (error instanceof Err) throw error

      throw Err.setStatus('InternalServerError').setMessage(
        'Could not create meal request!'
      )
    }
  }
}
