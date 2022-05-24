import express from 'express'
import setupMiddlwares from './midddlewares'

const app = express()
setupMiddlwares(app)
export default app
