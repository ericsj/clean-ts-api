import { AddAccount, AddAccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encryper: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encryper = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (accountData: AddAccountModel): Promise<boolean> {
    const hashedPassword = await this.encryper.encrypt(accountData.password)
    const isValid = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    return isValid
  }
}
