import { MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect (uri: string) {
    console.log(uri)
    this.client = await MongoClient.connect(uri)
  },

  async disconnect () {
    await this.client.close()
  },

  getCollection (name: string) {
    return this.client.db().collection(name)
  }
}
