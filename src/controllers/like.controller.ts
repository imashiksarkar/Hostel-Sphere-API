import { Err } from 'http-staror'
import { createLikeDto } from '../dtos/like.dto'
import catchAsync from '../lib/utils/catchAsync'
import { ReqWithUser } from '../middlewares/requireAuth'
import LikeService from '../services/like.service'
import ILikeService from '../types/LikeService.types'
import { Response, Request } from 'express'
import { ObjectId } from 'mongoose'

class LikeController {
  constructor(private likeService: ILikeService) {}

  createLike = catchAsync(async (req: ReqWithUser, res: Response) => {
    const liker = req.locals.user._id
    const meal = req.body.meal

    const validatedLike = createLikeDto.safeParse({ liker, meal })

    if (!validatedLike.success)
      throw Err.setStatus('BadRequest').setMessage(
        JSON.stringify(validatedLike.error.formErrors.fieldErrors)
      )

    await this.likeService.createLike(
      validatedLike.data.liker,
      validatedLike.data.meal
    )

    res.status(200).json({
      success: true,
      status: 'OK',
      message: 'Like created successfully',
    })
  })

  deleteLike = catchAsync(async (req: ReqWithUser, res: Response) => {
    const liker = req.locals.user._id
    const meal = req.body.meal

    const { data, success, error } = createLikeDto.safeParse({ liker, meal })

    if (!success)
      throw Err.setStatus('BadRequest').setMessage(
        JSON.stringify(error.formErrors.fieldErrors)
      )

    await this.likeService.deleteLike(data.liker, data.meal)

    res.status(200).json({
      success: true,
      status: 'OK',
      message: 'Like deleted successfully',
    })
  })

  fetchNumLikesByMeal = catchAsync(async (req: Request, res: Response) => {
    const mealId = req.params.mealId

    const likes = await this.likeService.fetchNumLikesByMeal(
      mealId as unknown as ObjectId
    )

    res.status(200).json({
      success: true,
      status: 'OK',
      data: likes,
    })
  })
}

const likeController = new LikeController(new LikeService())
export default likeController
