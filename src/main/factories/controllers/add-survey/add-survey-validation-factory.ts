import { RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators'

export const makeAddSurveyValidation = (): ValidationComposite => {
  return new ValidationComposite([
    ...['question', 'answers']
      .map(i => new RequiredFieldValidation(i))
  ])
}
