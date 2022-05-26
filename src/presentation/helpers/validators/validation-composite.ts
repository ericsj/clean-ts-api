import { Validation } from './validation'

export class ValidationComposite implements Validation {
  private readonly validations: Validation[]

  constructor (validations: Validation[]) {
    this.validations = validations
  }

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
