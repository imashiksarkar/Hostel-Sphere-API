import { Err } from 'http-staror'
import Like from '../models/Like.model'
import ILikeService from '../types/LikeService.types'
import mongoose, { ObjectId } from 'mongoose'

export default class LikeService implements ILikeService {
  createLike = async (userId: string, mealId: ObjectId) => {
    try {
      await Like.create({ likerFbId: userId, meal: mealId })
    } catch (error: unknown) {
      if (error instanceof mongoose.mongo.MongoError && error.code === 11000) {
        throw Err.setStatus('Conflict').setMessage('Meal is already liked!')
      }

      throw Err.setStatus('InternalServerError').setMessage(
        'Could not create like'
      )
    }
  }
  deleteLike = async (userId: string, mealId: ObjectId) => {
    try {
      const result = await Like.deleteOne({ likerFbId: userId, meal: mealId })

      if (!result.deletedCount)
        throw Err.setStatus('NotFound').setMessage('Like not found')
    } catch (error: unknown) {
      if (error instanceof Err) throw error

      throw Err.setStatus('InternalServerError').setMessage(
        'Could not create like'
      )
    }
  }

  fetchNumLikesByMeal = async (mealId: ObjectId) => {
    try {
      return await Like.countDocuments({ meal: mealId })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      throw Err.setStatus('InternalServerError').setMessage(
        'Could not fetch num likes'
      )
    }
  }
}
