import z from 'zod'

export const createUserDto = z.object({
  fbId: z.string().trim().min(1, 'Firebase user id is required.'),
  name: z.string().trim().min(1, 'User Name is required.'),
  email: z.string().trim().min(1, 'User email is required.').email(),
  image: z.string().trim().min(1, 'User image is required.').url(),
})
