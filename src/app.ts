import express from 'express'
import corsConfig from './config/cors.config'
import './config/env.config'
import dbConfig from './config/mongo.config'
import errorMiddleware from './middlewares/error.middleware'
import routes from './routes'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import { querySerialize } from './dtos/query.dto'
import { Err } from 'http-staror'
import catchAsync from './lib/utils/catchAsync'

const app = express()

app.use(corsConfig())

app.use(cookieParser())
app.use(express.json())

dbConfig.connect()

app.use(
  catchAsync((req, _res, next) => {
    const d = querySerialize(mongoSanitize.sanitize(req.query))

    if (!d.success)
      throw Err.setStatus('BadRequest').setMessage(JSON.stringify(d.data))

    req.query = JSON.parse(
      JSON.stringify(d.data).replaceAll(
        /\b(match|text|gte|lte|lt|gt|or|sort|skip|limit)\b/gi,
        (val) => `$${val}`
      )
    )

    next()
  })
)

app.use(routes)

app.use(errorMiddleware())

export default app
