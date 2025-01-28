import { Err } from 'http-staror'
import Meal from '../models/Meal.model'
import MealReq from '../models/MealRequest.model'
import { ICreateMealRequestDto, MealReqStatus } from '../types/Meal.types'
import IMealReqService from '../types/MealReqService.types'
import mongoose from 'mongoose'

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
    } catch (error: unknown) {
      if (error instanceof Err) throw error

      throw Err.setStatus('InternalServerError').setMessage(
        'Could not create meal request!'
      )
    }
  }

  find = async (userId?: string) => {
    try {
      const aggregationStages = [
        {
          $lookup: {
            from: 'meals',
            localField: 'meal',
            foreignField: '_id',
            as: 'meal',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'requestor',
            foreignField: '_id',
            as: 'requestor',
          },
        },
        { $unwind: { path: '$meal' } },
        { $unwind: { path: '$requestor' } },
        {
          $lookup: {
            from: 'users',
            localField: 'meal.distributor',
            foreignField: 'fbId',
            as: 'meal.distributor',
          },
        },
        { $unwind: { path: '$meal.distributor' } },
        {
          $project: {
            _id: 1,
            status: 1,
            meal: { _id: 1, title: 1, status: 1 },
            distributor: {
              _id: '$meal.distributor._id',
              fbId: '$meal.distributor.fbId',
              name: '$meal.distributor.name',
              email: '$meal.distributor.email',
            },
            requestor: {
              _id: 1,
              fbId: 1,
              name: 1,
              email: 1,
            },
          },
        },
      ]

      if (userId) {
        aggregationStages.unshift({
          $match: {
            requestor: new mongoose.Types.ObjectId(userId),
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
      }

      const mealReqs = await MealReq.aggregate(aggregationStages, {
        maxTimeMS: 60000,
        allowDiskUse: true,
      })

      return mealReqs
    } catch (error: unknown) {
      if (error instanceof Err) throw error
      throw Err.setStatus('InternalServerError').setMessage(
        'Could not find meal requests'
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
