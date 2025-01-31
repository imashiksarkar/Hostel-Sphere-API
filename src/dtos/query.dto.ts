import z from 'zod'

export const querySerialize = <T>(data: T) =>
  z
    .object({
      q: z.string().trim().min(1).optional(),
      price: z
        .record(
          z.enum(['gt', 'gte', 'lt', 'lte']),
          z.preprocess((val) => parseInt(val as string), z.number().min(0))
        )
        .or(
          z
            .string()
            .trim()
            .transform((val) => parseInt(val as string))
            .refine((val) => val > 0, {
              message: 'Price must be greater than 0',
            })
            .optional()
        ),
      category: z.enum(['breakfast', 'lunch', 'dinner']).optional(),
      sort: z
        .preprocess(
          (val) =>
            (val as string).split(',').reduce((prev, v) => {
              const isDesc = v.charAt(0) === '-'
              const filter = isDesc ? v.trim().slice(1, v.length) : v.trim()

              prev[filter] = isDesc ? -1 : 1

              return prev
            }, {} as Record<string, -1 | 1>),
          z.record(z.union([z.literal(1), z.literal(-1)]))
        )
        .optional(),
      skip: z
        .preprocess((val) => parseInt(val as string), z.number().min(0))
        .optional(),
      limit: z
        .preprocess((val) => parseInt(val as string), z.number().min(0))
        .optional(),
    })
    .safeParse(data)
