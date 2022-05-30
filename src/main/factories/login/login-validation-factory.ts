import { RequiredFieldValidation, ValidationComposite, EmailValidation } from '../../../presentation/helpers/validators'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  return new ValidationComposite([
    ...['email', 'password']
      .map(i => new RequiredFieldValidation(i)),
    new EmailValidation('email', new EmailValidatorAdapter())
  ])
}
