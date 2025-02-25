import { ObjectId } from 'mongoose'

export default interface ILikeService {
  createLike: (userId: string, mealId: ObjectId) => Promise<void>
  deleteLike: (userId: string, mealId: ObjectId) => Promise<void>
  fetchNumLikesByMeal: (mealId: ObjectId) => Promise<number>
}
