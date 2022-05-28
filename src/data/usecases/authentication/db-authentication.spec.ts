import { AccountModel } from '../../../domain/models/account'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { TokenGenerator } from '../../protocols/criptography/token-generator'

describe('DbAuthentication UseCase', () => {
  interface SutTypes {
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashComparer
    tokenGeneratorStub: TokenGenerator
    sut: Authentication
  }

  const makeFakeAccount = (): AccountModel => {
    return {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    }
  }

  const makeFakeAuthentication = (): AuthenticationModel => {
    return {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  }

  const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel | null> {
        return await new Promise(resolve => resolve(makeFakeAccount()))
      }
    }
    return new LoadAccountByEmailRepositoryStub()
  }

  const makeHashComparer = (): HashComparer => {
    class HashComparerStub implements HashComparer {
      async compare (value: string, hashedPassword: string): Promise<boolean> {
        return await new Promise((resolve) => resolve(true))
      }
    }
    return new HashComparerStub()
  }

  const makeTokenGenerator = (): TokenGenerator => {
    class TokenGeneratorStub implements TokenGenerator {
      async generate (id: string): Promise<string> {
        return await new Promise((resolve) => resolve('token'))
      }
    }
    return new TokenGeneratorStub()
  }

  const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const hashComparerStub = makeHashComparer()
    const tokenGeneratorStub = makeTokenGenerator()
    return {
      loadAccountByEmailRepositoryStub,
      hashComparerStub,
      tokenGeneratorStub,
      sut: new DbAuthentication(loadAccountByEmailRepositoryStub,
        hashComparerStub, tokenGeneratorStub
      )
    }
  }

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith(makeFakeAuthentication().email)
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockResolvedValueOnce(null)
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const encryptSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(encryptSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const encryptSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthentication())
    expect(encryptSpy).toHaveBeenCalledWith('any_id')
  })
})
