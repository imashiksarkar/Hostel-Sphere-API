import { Router } from 'express'
import { mealController, mealReqController } from '../controllers'
import requireAuth from '../middlewares/requireAuth'

const mealRouter = Router()

mealRouter.get('/', mealController.fetchMeals)
mealRouter.post('/', requireAuth(), mealController.createMeal)

mealRouter.get('/request', requireAuth(true), mealReqController.fetchMealReqs)
mealRouter.post('/request', requireAuth(), mealReqController.createMealReq)
mealRouter.patch(
  '/request/:mealReqId',
  requireAuth(),
  mealReqController.updateMealReq
)

export default mealRouter
