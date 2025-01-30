import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config({
  path: './.env.local',
})

const envParser = z.object({
  APP_NAME: z.string().trim().min(2, 'App name must be 2 chars or more.'),
  PORT: z
    .string()
    .transform((port) => parseInt(port))
    .refine((port) => !isNaN(port), { message: 'Port Must Be Number.' }),
  ENV: z.enum(['development', 'production', 'test']),
  DB_CONNECTION_URL: z.string().trim().url('Invalid Database URL.'),
  FIREBASE_PRIVATE_KEY: z
    .string()
    .trim()
    .min(3, 'JWT Secret must be 3 chars or more.')
    .transform((key) => {
      const buff = Buffer.from(key, 'base64')
      return buff.toString('utf-8')
    }),
  STRIPE_API_SECRET_KEY: z
    .string()
    .trim()
    .min(3, 'JWT Secret must be 3 chars or more.'),
})

const { success, data, error } = envParser.safeParse(process.env)

if (!success) {
  console.error(JSON.stringify(error?.errors))
  process.exit(1)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { FIREBASE_PRIVATE_KEY, ENV, ...rest } = data

const env = {
  ...rest,
  IS_PRODUCTION: data.ENV === 'production',
  SERVICE_ACCOUNT: JSON.parse(data.FIREBASE_PRIVATE_KEY),
}

export default env
