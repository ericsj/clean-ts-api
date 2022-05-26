import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation'
import { EmailValidation } from '../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export const makeSignupValidation = (): ValidationComposite => {
  return new ValidationComposite([
    ...['name', 'email', 'password', 'passwordConfirmation']
      .map(i => new RequiredFieldValidation(i)),
    new CompareFieldsValidation('password', 'passwordConfirmation'),
    new EmailValidation('email', new EmailValidatorAdapter())
  ])
}
