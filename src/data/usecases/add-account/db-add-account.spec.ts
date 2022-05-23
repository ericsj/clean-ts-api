import { DbAddAccount } from './db-add-account'
import { Encrypter, AddAccountModel, AddAccountRepository } from './db-add-account-protocols'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub {
    async encrypt (value: string): Promise<string> {
      return await new Promise((resolve) => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<true> {
      return await new Promise((resolve) => resolve(true))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}
describe('DbAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { encrypterStub, sut } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid name',
      email: 'valid_mail@mail.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { encrypterStub, sut } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid name',
      email: 'valid_mail@mail.com',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const encryptSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      name: 'valid name',
      email: 'valid_mail@mail.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith({ ...accountData, password: 'hashed_password' })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid name',
      email: 'valid_mail@mail.com',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = {
      name: 'valid name',
      email: 'valid_mail@mail.com',
      password: 'valid_password'
    }
    const result = await sut.add(accountData)
    expect(result).toEqual(true)
  })
})
