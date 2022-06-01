import { CompareFieldsValidation, RequiredFieldValidation, EmailValidation, ValidationComposite } from '../../../../presentation/helpers/validators'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter'

export const makeSignupValidation = (): ValidationComposite => {
  return new ValidationComposite([
    ...['name', 'email', 'password', 'passwordConfirmation']
      .map(i => new RequiredFieldValidation(i)),
    new CompareFieldsValidation('password', 'passwordConfirmation'),
    new EmailValidation('email', new EmailValidatorAdapter())
  ])
}
