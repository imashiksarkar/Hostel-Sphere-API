import z from 'zod'
import subscriptionEnum from '../constants/subscription'
import { Err } from 'http-staror'

export const createSubscriptionDto = <T>(data: T) => {
  const {
    data: res,
    success,
    error,
  } = z
    .object({
      plan: z.enum(subscriptionEnum),
    })
    .safeParse(data)

  if (!success) throw Err.setStatus('BadRequest').setMessage(error.message)

  return res
}
