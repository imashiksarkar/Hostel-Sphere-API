import { ObjectId } from 'mongoose'

export default interface ILikeService {
  createLike: (userId: ObjectId, mealId: ObjectId) => Promise<void>
  deleteLike: (userId: ObjectId, mealId: ObjectId) => Promise<void>
}
