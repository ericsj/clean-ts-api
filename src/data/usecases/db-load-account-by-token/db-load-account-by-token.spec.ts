import { AccountModel } from '../../../domain/models/account'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid name',
  email: 'valid_mail@mail.com',
  password: 'valid_password'
})

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new DecrypterStub()
}

const makeLoadAcccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAcccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAcccountByTokenRepositoryStub()
}

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAcccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const loadAcccountByTokenRepositoryStub = makeLoadAcccountByTokenRepository()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAcccountByTokenRepositoryStub)
  return { sut, decrypterStub, loadAcccountByTokenRepositoryStub }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)
    const account = await sut.load('any_token')
    expect(account).toBeNull()
  })

  test('Should call LoadAcccountByTokenRepository with correct values', async () => {
    const { sut, loadAcccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAcccountByTokenRepositoryStub, 'loadByToken')
    await sut.load('any_token', 'any_role')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('Should return null if LoadAcccountByTokenRepository returns null', async () => {
    const { sut, loadAcccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAcccountByTokenRepositoryStub, 'loadByToken').mockResolvedValueOnce(null)
    const account = await sut.load('any_token')
    expect(account).toBeNull()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_token')
    expect(account).toEqual(makeFakeAccount())
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())
    const account = sut.load('any_token')
    await expect(account).rejects.toThrow()
  })

  test('Should throw if LoadAcccountByTokenRepository throws', async () => {
    const { sut, loadAcccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAcccountByTokenRepositoryStub, 'loadByToken').mockRejectedValueOnce(new Error())
    const account = sut.load('any_token')
    await expect(account).rejects.toThrow()
  })
})
