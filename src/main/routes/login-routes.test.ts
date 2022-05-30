import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? 'mongodb://127.0.0.1:42161/jest?')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('Should 200 on signup', async () => {
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
})
