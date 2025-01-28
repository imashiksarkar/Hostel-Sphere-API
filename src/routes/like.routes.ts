import { Router } from 'express'
import requireAuth from '../middlewares/requireAuth'
import { likeController } from '../controllers'

const likeRouter = Router()

likeRouter.post('/', requireAuth(), likeController.createLike)
likeRouter.delete('/', requireAuth(), likeController.deleteLike)

export default likeRouter
