import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { AccountModel } from '../../../domain/models/account'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly decrypeter: Decrypter) {}
  async load (accessToken: string, role?: string): Promise<AccountModel> {
    await this.decrypeter.decrypt(accessToken)
    return null
  }
}
