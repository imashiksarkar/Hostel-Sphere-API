import { Router } from 'express'
import { mealController, mealReqController } from '../controllers'
import requireAuth from '../middlewares/requireAuth'

const mealRouter = Router()

mealRouter.get('/', mealController.fetchMeals)
mealRouter.post('/', requireAuth(), mealController.createMeal)
mealRouter.post('/request', requireAuth(), mealReqController.createMealReq)

export default mealRouter
