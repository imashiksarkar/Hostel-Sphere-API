import z from 'zod'
import { createUserDto } from '../dtos/user.dto'

export type UserAttr = z.infer<typeof createUserDto>

export default interface IUser extends UserAttr {
  _id: string
  role: 'admin' | 'user' // default 'user'
  subscription: string | null // ref -> subscriptions._id
  createdAt: Date
  updatedAt: Date
}
