import { Response, Request } from 'express'
import { Err, Http } from 'http-staror'
import { createMealDto } from '../dtos/meal.dto'
import catchAsync from '../lib/utils/catchAsync'
import { ReqWithUser } from '../middlewares/requireAuth'
import MealService from '../services/meal.service'
import IMealService, { QueryParams } from '../types/MealService.types'
import { isValidObjectId } from 'mongoose'

class MealController {
  constructor(private mealService: IMealService) {}

  createMeal = catchAsync(async (req: ReqWithUser, res: Response) => {
    const { success, data, error } = createMealDto.safeParse(req.body)

    if (!success)
      throw Err.setStatus('BadRequest').setMessage(
        JSON.stringify(error.formErrors.fieldErrors)
      )

    const userId = req.locals.user.fbId
    const meal = await this.mealService.create({ ...data, distributor: userId })

    res.status(201).json({
      success: true,
      status: Http.setStatus('Created').status,
      data: meal,
    })
  })

  fetchMeals = catchAsync(async (req: Request, res: Response) => {
    const meals = await this.mealService.fetchMeals(req.query as QueryParams)
    res.status(200).json({
      success: true,
      status: 'OK',
      data: meals,
    })
  })

  fetchMealById = catchAsync(
    async (req: ReqWithUser<'passThrough'>, res: Response) => {
      if (!isValidObjectId(req.params.mealId))
        throw Err.setStatus('BadRequest').setMessage('Invalid id')

      const userId = req.locals.user?._id
      if (userId && !isValidObjectId(userId))
        throw Err.setStatus('BadRequest').setMessage('Invalid user id')

      const meal = await this.mealService.fetchMealById(
        req.params.mealId,
        userId
      )
      res.status(200).json({
        success: true,
        status: 'OK',
        data: meal,
      })
    }
  )
}

const mealController = new MealController(new MealService())

export default mealController
