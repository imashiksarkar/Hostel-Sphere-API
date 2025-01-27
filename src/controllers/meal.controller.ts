import { Response } from 'express'
import { Err, Http } from 'http-staror'
import { createMealDto } from '../dtos/meal.dto'
import catchAsync from '../lib/utils/catchAsync'
import { ReqWithUser } from '../middlewares/requireAuth'
import MealService from '../services/meal.service'
import IMealService from '../types/MealService.types'

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
}

const mealController = new MealController(new MealService())

export default mealController
