import { Err } from 'http-staror'
import Meal from '../models/Meal.model'
import MealReq from '../models/MealRequest.model'
import { ICreateMealRequestDto, MealReqStatus } from '../types/Meal.types'
import IMealReqService from '../types/MealReqService.types'

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

  updateStatus = async (
    userId: string,
    userRole: 'admin' | 'user',
    id: string,
    status: MealReqStatus
  ) => {
    try {
      const mealReq = await MealReq.findOne({ _id: id, status: 'pending' })
      if (!mealReq)
        throw Err.setStatus('NotFound').setMessage('Meal req not found!')

      if (userRole === 'user' && userId !== mealReq.requestor.toString())
        throw Err.setStatus('Unauthorized').setMessage('Not authorized')

      mealReq.status = status

      return await mealReq.save()
    } catch (error: unknown) {
      if (error instanceof Err) throw error
      throw Err.setStatus('InternalServerError').setMessage(
        'Could not serve meal'
      )
    }
  }
}
