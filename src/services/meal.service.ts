import { Err } from 'http-staror'
import Meal from '../models/Meal.model'
import IMeal, { CreateMealDto } from '../types/Meal.types'
import IMealService, { QueryParams } from '../types/MealService.types'
import { PipelineStage } from 'mongoose'

export default class MealService implements IMealService {
  create = async (meal: CreateMealDto) => {
    const newMeal = new Meal(meal)
    return await newMeal.save()
  }

  fetchMeals = async (aggregation: QueryParams) => {
    const { q, category, price,status, $sort, $limit, $skip } = aggregation

    const aggregationStages = []

    const match: {
      $match: Record<string, unknown>
    } = {
      $match: {
        $text: {
          $search: q,
        },
        category,
        price,
        status
      },
      
    }

    if (!q) delete match.$match.$text
    if (!category) delete match.$match.category
    if (!price) delete match.$match.price
    if (!status) delete match.$match.status

    aggregationStages.push(match)
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

    if ($sort) {
      aggregationStages.push({
        $sort,
      })
    }

    if ($skip) {
      aggregationStages.push({
        $skip,
      })
    }

    if ($limit) {
      aggregationStages.push({
        $limit,
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
    }>(aggregationStages as PipelineStage[])

    if (foundMeals.length === 0)
      throw Err.setStatus('NotFound').setMessage('No meals found!')

    const { data: meals, count: totalDocs } = foundMeals[0]

    return { totalDocs, meals }
  }

  fetchMealById = async (id: string) => {
    const meal = await Meal.findById(id)
    if (!meal) throw Err.setStatus('NotFound').setMessage('Meal not found!')
    return meal
  }
}
