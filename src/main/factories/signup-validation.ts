import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeSignupValidation = (): ValidationComposite => {
  return new ValidationComposite(['name', 'email', 'password', 'passwordConfirmation']
    .map(i => new RequiredFieldValidation(i)))
}
