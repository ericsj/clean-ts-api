import { makeLoginValidation } from './login-validation-factory'
import { RequiredFieldValidation, EmailValidation, ValidationComposite } from '../../../../validation/validators'
import { EmailValidator } from '../../../../presentation/protocols'

jest.mock('../../../../validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignupValidation Factory', () => {
  test('Should call validationComposite with all validations', () => {
    makeLoginValidation()
    expect(ValidationComposite).toHaveBeenCalledWith([
      ...['email', 'password'].map(i => new RequiredFieldValidation(i)),
      new EmailValidation('email', makeEmailValidator())
    ])
  })
})
