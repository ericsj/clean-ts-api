import { CompareFieldsValidation } from './compare-fields-validation'
import { InvalidParamError } from '../../errors'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('password', 'passwordConfirmation')
}
describe('CompareFields Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      password: 'any_password',
      passwordConfirmation: 'other_password'
    })
    expect(error).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Should return null if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      password: 'any_password',
      passwordConfirmation: 'any_password'
    })
    expect(error).toBeNull()
  })
})
