import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? 'mongodb://127.0.0.1:42161/jest?')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('account')
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('Should 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'question',
          answers: [
            {
              image: 'string',
              answer: 'string'
            },
            {
              answer: 'string'
            }
          ]
        })
        .expect(403)
    })

    test('Should 204 on add survey with valid token', async () => {
      const res = await accountCollection.insertOne({
        name: 'string',
        email: 'string@mail.com',
        password: '123',
        role: 'admin'
      })
      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.jwtSecret)
      await accountCollection.updateOne(
        {
          _id: id
        }, {
          $set: {
            accessToken
          }
        }
      )
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'question',
          answers: [
            {
              image: 'string',
              answer: 'string'
            },
            {
              answer: 'string'
            }
          ]
        })
        .expect(403)
    })
  })
})
