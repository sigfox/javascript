const { URL } = require('url');
const { MongoClient } = require('mongodb');
const Chance = require('chance');

const validateConfig = require('./validateConfig');
const anonymizeCollection = require('./anonymizeCollection');

module.exports = async function mongoanym(url, config) {
  const validation = validateConfig(config);
  if (!validation.valid) throw validation.errors[0];
  const mongoURL = new URL(url);
  const dbName = mongoURL.pathname.split('/')[1];
  if (!dbName) {
    throw new Error('Database needs to specify in the mongodb URL.');
  }
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const chance = new Chance(dbName);
  const db = client.db(dbName);
  await config.collections.reduce(async (previousPromise, collectionConfig) => {
    await previousPromise;
    return anonymizeCollection(db, collectionConfig, chance);
  }, Promise.resolve());
  await client.close();
};
