const _ = require('lodash');

module.exports = async function anonymizeCollection(db, collectionConfig, chance) {
  const collection = db.collection(collectionConfig.name);
  const projection = collectionConfig.fields.reduce((acc, field) => {
    acc[field.name] = 1;
    return acc;
  });

  const batchSize = collectionConfig.batchSize || 100;
  const cursor = collection.find({}, { projection, sort: { _id: 1 } }).batchSize(batchSize);

  let bulk = collection.initializeUnorderedBulkOp();
  let count = 0;

  const methodsByField = collectionConfig.fields.reduce((acc, field) => {
    acc[field.name] = { name: field.method, args: field.args };
    return acc;
  }, {});

  // eslint-disable-next-line no-await-in-loop
  for (let document = await cursor.next(); document != null; document = await cursor.next()) {
    const fieldsAnonymized = collectionConfig.fields.reduce((newDocument, field) => {
      if (_.get(document, field.name)) {
        const method = methodsByField[field.name];
        newDocument[field.name] = chance[method.name](method.args);
      }

      return newDocument;
    }, {});

    if(Object.keys(fieldsAnonymized).length >= 1) {
      bulk.find({ _id: document._id }).updateOne({ $set: fieldsAnonymized });
      count += 1;
    }
    if (count >= batchSize) {
      // eslint-disable-next-line no-await-in-loop
      await bulk.execute();
      count = 0;
      bulk = collection.initializeUnorderedBulkOp();
    }
  }
  // execute bulk if anything left over
  if (count > 0) await bulk.execute();
};
