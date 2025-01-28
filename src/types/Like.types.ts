import { ObjectId } from 'mongoose'
import { createLikeDto } from '../dtos/like.dto'
import z from 'zod'

export default interface ILike {
  _id: ObjectId
  liker: ObjectId // ref -> users._id
  meal: ObjectId // ref -> meals._id
  createdAt: Date
  updatedAt: Date
}

export type CreateLikeDto = z.infer<typeof createLikeDto>
