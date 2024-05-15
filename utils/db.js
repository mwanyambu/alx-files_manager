const { mongoClient } = require('mongodb');
import Collection from 'mongodb/lib/collection';
import envloader from './env_loader';
/**
 * mogodb client
 */
class DBClient {
  /**
   * instance of DBClient
   */
  constructor () {
    const host = process.env.DB.HOST || 'localhost';
    const port = process.env.DB.PORT || 27017;
    const database = process.env.DB.DATABASE || 'files_manager';

    const uri = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(uri, { useNewUriParser: true, useUnifiedTopology: true });
    this.client.connect()
  }
  isAlive() {
    return this.client.isConnected();
  }
  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }
  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }
  async usersCollection() {
    return this.client.db().collection('users');
  }
  async filesCollection() {
    return this.client.db().collection('files');
  }
}

export const dbClient = new DBClient();
export default dbclient;