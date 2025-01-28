import Meal from '../models/Meal.model'
import IMeal, { CreateMealDto } from '../types/Meal.types'
import IMealService from '../types/MealService.types'

export default class MealService implements IMealService {
  create = async (meal: CreateMealDto) => {
    const newMeal = new Meal(meal)
    return await newMeal.save()
  }

  fetchMeals = async (
    sortFilter?: string,
    skip: number = 0,
    limit: number = 10
  ) => {
    const fltr: { [key: string]: 1 | -1 } = sortFilter?.startsWith('-')
      ? { [sortFilter.slice(1)]: -1 }
      : { [sortFilter as string]: 1 }

    const totalDocs = await Meal.find().countDocuments()

    const aggregationStages = []

    if (sortFilter)
      aggregationStages.push({
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'meal',
          as: 'result',
        },
      })

    aggregationStages.push({
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'meal',
        as: 'result',
      },
    })

    aggregationStages.push({
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
    })

    if (sortFilter)
      aggregationStages.push({
        $sort: { ...fltr },
      })

    if (skip)
      aggregationStages.push({
        $skip: skip,
      })

    if (limit)
      aggregationStages.push({
        $limit: limit,
      })

    const meals = (await Meal.aggregate(aggregationStages)) as IMeal[]

    return { totalDocs, meals }
  }
}
