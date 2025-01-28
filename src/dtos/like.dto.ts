import z from 'zod'
import { isValidObjectId, ObjectId } from 'mongoose'

export const createLikeDto = z.object({
  meal: z
    .string()
    .transform((val) => val as unknown as ObjectId)
    .refine((val) => isValidObjectId(val), { message: 'Invalid id' }),
  liker: z
    .string()
    .transform((val) => val as unknown as ObjectId)
    .refine((val) => isValidObjectId(val), { message: 'Invalid id' }),
})
