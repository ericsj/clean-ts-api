import { Validation } from '../../presentation/protocols/validation'

export class ValidationComposite implements Validation {
  constructor (private readonly validations: Validation[]) {}

  validate (input: any): Error | null {
    for (const validations of this.validations) {
      const error = validations.validate(input)
      if (error) {
        return error
      }
    }
    return null
  }
}
