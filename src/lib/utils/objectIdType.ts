import { Err } from 'http-staror'
import { isValidObjectId as isValid, ObjectId } from 'mongoose'
import z from 'zod'

const isValidObjectId = <T>(data: T) => {
  const { data: id, success } = z
    .string()
    .transform((val) => val as unknown as ObjectId)
    .refine((val) => isValid(val), { message: 'Invalid id' })
    .safeParse(data)

  if (!success) throw Err.setStatus('BadRequest').setMessage('Id is not valid!')

  return id as unknown as string
}

export default isValidObjectId
