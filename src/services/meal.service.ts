import { Err } from 'http-staror'
import Meal from '../models/Meal.model'
import IMeal, { CreateMealDto } from '../types/Meal.types'
import IMealService from '../types/MealService.types'

export default class MealService implements IMealService {
  create = async (meal: CreateMealDto) => {
    const newMeal = new Meal(meal)
    return await newMeal.save()
  }

  fetchMeals = async (
    category?: string,
    sort?: string,
    skip: number = 0,
    limit: number = 10
  ) => {
    const fltr: { [key: string]: 1 | -1 } = sort?.startsWith('-')
      ? { [sort.slice(1)]: -1 }
      : { [sort as string]: 1 }

    const aggregationStages = []

    if (category) {
      aggregationStages.push({
        $match: {
          category: category,
        },
      })
    }

    if (sort) {
      aggregationStages.push({
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'meal',
          as: 'result',
        },
      })
    }

    ;[
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'meal',
          as: 'result',
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          image: 1,
          price: 1,
          description: 1,
          status: 1,
          category: 1,
          distributor: 1,
          ingredients: 1,
          rating: 1,
          createdAt: 1,
          updatedAt: 1,
          likes: {
            $size: '$result',
          },
        },
      },
    ].forEach((stage) => aggregationStages.push(stage))

    if (sort) {
      aggregationStages.push({
        $sort: { ...fltr },
      })
    }

    if (skip) {
      aggregationStages.push({
        $skip: skip,
      })
    }

    if (limit) {
      aggregationStages.push({
        $limit: limit,
      })
    }

    ;[
      {
        $facet: {
          data: [],
          count: [{ $count: 'total' }],
        },
      },
      { $unwind: '$count' },
      { $set: { count: '$count.total' } },
    ].forEach((stage) => aggregationStages.push(stage))

    const foundMeals = await Meal.aggregate<{
      count: number
      data: IMeal[]
    }>(aggregationStages)

    if (foundMeals.length === 0)
      throw Err.setStatus('NotFound').setMessage('No meals found!')

    const { data: meals, count: totalDocs } = foundMeals[0]

    return { totalDocs, meals }
  }
}
