import { Router } from 'express'
import { mealController } from '../controllers'
import requireAuth from '../middlewares/requireAuth'

const mealRouter = Router()

mealRouter.post('/', requireAuth(), mealController.createMeal)

export default mealRouter
