import { makeSignupValidation } from './signup-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SignupValidation Factory', () => {
  test('Should call validationComposite with all validations', () => {
    makeSignupValidation()
    expect(ValidationComposite).toHaveBeenCalledWith(
      ['name', 'email', 'password', 'passwordConfirmation'].map(i => new RequiredFieldValidation(i))
    )
  })
})
