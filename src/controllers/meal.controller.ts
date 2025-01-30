import { Response, Request } from 'express'
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

  fetchMeals = catchAsync(async (req: Request, res: Response) => {
    const { category, sort, skip, limit } = req.query

    const meals = await this.mealService.fetchMeals(
      category as string,
      sort as string,
      parseInt(skip as string),
      parseInt(limit as string)
    )
    res.status(200).json({
      success: true,
      status: 'OK',
      data: meals,
    })
  })
}

const mealController = new MealController(new MealService())

export default mealController
