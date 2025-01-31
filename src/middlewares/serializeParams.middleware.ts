import { Err } from 'http-staror'
import { querySerialize } from '../dtos/query.dto'
import catchAsync from '../lib/utils/catchAsync'
import mongoSanitize from 'express-mongo-sanitize'

const serializeParams = () =>
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

export default serializeParams
