import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators'

jest.mock('../../../../validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('Should call validationComposite with all validations', () => {
    makeAddSurveyValidation()
    expect(ValidationComposite).toHaveBeenCalledWith([
      ...['question', 'answers'].map(i => new RequiredFieldValidation(i))
    ])
  })
})
