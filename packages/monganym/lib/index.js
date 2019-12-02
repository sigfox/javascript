const { MongoClient } = require('mongodb');
const Chance = require('chance');

const validateConfig = require('./validateConfig');
const anonymizeCollection = require('./anonymizeCollection');

module.exports = async function mongoanym(url, config) {
  const validation = validateConfig(config);
  if (!validation.valid) throw validation.errors[0];
  const client = new MongoClient(url, { useUnifiedTopology: true });
  if (!client.s.options.dbName) throw new Error('Database need to specify in the mongodb URL.');
  const chance = new Chance(client.s.options.dbName);
  await client.connect();
  const db = client.db(client.s.options.dbName);
  await config.collections.reduce(async (previousPromise, collectionConfig) => {
    await previousPromise;
    return anonymizeCollection(db, collectionConfig, chance);
  }, Promise.resolve());
  await client.close();
};
