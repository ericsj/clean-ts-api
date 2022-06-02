import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let surveyCollection: Collection

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
  })

  describe('POST /surveys', () => {
    test('Should 204 on add survey success', async () => {
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
        .expect(204)
    })
  })
})
