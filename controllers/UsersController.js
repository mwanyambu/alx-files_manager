import { v4 as uuidv4 } from 'uuid';
const sha1 = require('sha1');
const dbClient = require('../utils/db');
import Queue from 'bull/lib/queue';

const userQueue = new Queue('email sending');

export default class UsersController {
  static async postNew(req, res) {
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;

    if (!email) { 
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
    const userExists = await (await dbClient.usersCollection()).findOne({ email })
    if (userExists) {
      return res.status(400).json({ error: 'Already exists' });
    }
    const newInfo = await (await dbClient.usersCollection())
      .insertOne({ email, password: sha1(password) });
    const userId = newInfo.insertedId.toString();

    userQueue.add({ userId });
    res.status(201).json({ email, id: userId });
  }
  static async getMe(req, res) {
    const { user } = req;
    res.status(200).json({ email: user.email, id: user._id.toString() });
  }
}