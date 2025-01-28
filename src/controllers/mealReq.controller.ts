import { Response } from 'express'
import { Err, Http } from 'http-staror'
import { createMealReqDto } from '../dtos/meal.dto'
import catchAsync from '../lib/utils/catchAsync'
import { ReqWithUser } from '../middlewares/requireAuth'
import IMealReqService from '../types/MealReqService.types'
import { ObjectId } from 'mongoose'
import MealReqService from '../services/mealReq.service'

class MealReqController {
  constructor(private mealReqService: IMealReqService) {}

  createMealReq = catchAsync(async (req: ReqWithUser, res: Response) => {
    const userId = req.locals.user._id as unknown as ObjectId

    const { success, data, error } = createMealReqDto.safeParse({
      ...req.body,
      requestor: userId,
    })

    if (!success)
      throw Err.setStatus('BadRequest').setMessage(JSON.stringify(error))

    const meal = await this.mealReqService.create({
      meal: data.meal,
      requestor: data.requestor,
    })

    res.status(201).json({
      success: true,
      status: Http.setStatus('Created').status,
      data: meal,
    })
  })
}

const mealReqController = new MealReqController(new MealReqService())
export default mealReqController
