import { Router } from 'express'
import { makeSignupController } from '../factories/controllers/signup/signup'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoginController } from '../factories/controllers/login/login-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignupController())) // eslint-disable-line
  router.post('/login', adaptRoute(makeLoginController())) // eslint-disable-line
}
