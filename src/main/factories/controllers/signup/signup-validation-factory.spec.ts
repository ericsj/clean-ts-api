import { makeSignupValidation } from './signup-validation-factory'
import { RequiredFieldValidation, EmailValidation, CompareFieldsValidation, ValidationComposite } from '../../../../validation/validators'
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
    makeSignupValidation()
    expect(ValidationComposite).toHaveBeenCalledWith([
      ...['name', 'email', 'password', 'passwordConfirmation'].map(i => new RequiredFieldValidation(i)),
      new CompareFieldsValidation('password', 'passwordConfirmation'),
      new EmailValidation('email', makeEmailValidator())
    ])
  })
})
