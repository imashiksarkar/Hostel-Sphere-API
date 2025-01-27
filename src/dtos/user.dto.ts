import z from 'zod'

export const createUserDto = z.object({
  fbId: z.string().trim().min(1, 'Firebase user id is required.'),
  name: z.string().trim().min(1, 'User Name is required.'),
  email: z.string().trim().min(1, 'User email is required.').email(),
  image: z.string().trim().min(1, 'User image is required.').url(),
})

export const listUsersDto = z.array(
  z.object({
    uid: z.string().optional(),
    email: z.string().optional(),
    displayName: z.string().optional(),
    photoURL: z.string().optional(),
    customClaims: z
      .object({
        role: z.string().optional(),
        userId: z.string().optional(),
      })
      .optional(),
  })
)
