const mongoose = require('mongoose');
const { userSchema } = require('./schema');

const MONGO_TEST_URL = process.env.MONGO_TEST_URL || 'mongodb://localhost:27017/flive-app-test';

const startMongo = async () => {
  const db = await mongoose.connect(MONGO_TEST_URL, {
    useMongoClient: true
  });
  db.model('User', userSchema);
  return db;
};

const stopAndClearMongo = async (db) => {
  await db.dropDatabase();
  await db.close();
};

module.exports.startMongo = startMongo;
module.exports.stopAndClearMongo = stopAndClearMongo;
