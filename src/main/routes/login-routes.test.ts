import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? 'mongodb://127.0.0.1:42161/jest?')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
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

  describe('POST /login', () => {
    test('Should 200 on login', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'string',
        email: 'string@mail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'string@mail.com',
          password: '123'
        })
        .expect(200)
    })
  })
})
