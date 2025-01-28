import { Err } from 'http-staror'
import Like from '../models/Like.model'
import ILikeService from '../types/LikeService.types'
import { ObjectId } from 'mongoose'

export default class LikeService implements ILikeService {
  createLike = async (userId: ObjectId, mealId: ObjectId) => {
    try {
      await Like.create({ liker: userId, meal: mealId })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      throw Err.setStatus('InternalServerError').setMessage(
        'Could not create like'
      )
    }
  }
  deleteLike = async (userId: ObjectId, mealId: ObjectId) => {
    try {
      await Like.deleteOne({ liker: userId, meal: mealId })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      throw Err.setStatus('InternalServerError').setMessage(
        'Could not create like'
      )
    }
  }
}
