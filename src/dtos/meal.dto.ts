import z from 'zod'
import categories from '../constants/categories'

export const createMealDto = z.object({
  title: z.string().trim().min(2, 'Min 2 chars.'),
  image: z.string().trim().min(5, 'Image is required.').url(),
  price: z.number().min(10, 'Price must be greater than or equal to 10.'),
  description: z.string().trim().min(10, 'Min 10 chars.'),
  status: z
    .enum(['upcoming'], {
      message: 'Status must be "upcoming" or just omit the field.',
    })
    .optional(),
  category: z.enum(categories),
  ingredients: z
    .array(z.string().trim().min(3, 'Min 3 chars.'))
    .min(1, 'Min 1 ingredient'),
})
