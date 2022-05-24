import request from 'supertest'
import app from '../config/app'

describe('Signup Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'string',
        email: 'string@mail.com',
        password: 'string',
        passwordConfirmation: 'string'
      })
      .expect(200)
  })
})
