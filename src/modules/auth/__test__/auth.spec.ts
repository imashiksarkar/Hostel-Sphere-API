import request from 'supertest'
import app from '@/app'

describe('auth', () => {
  it('should be able to login', async () => {
    const res = await request(app).get('/health').expect(200)
    // console.log(res.body)

    expect(res.body.status).toMatch(/up/gi)
  })
})
