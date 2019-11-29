const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

const Chance = require('chance');
const chance = new Chance();

const collections = require('./buy.json');
const {fieldSchema, collectionSchema, collectionsSchema} = require('./dataSchema.js');
const Validator = require('jsonschema').Validator;
const { isEmpty } = require('lodash');

const BulkHasOperations = (b) => b && b.s && b.s.currentBatch && b.s.currentBatch.operations && b.s.currentBatch.operations.length > 0;


const anonymize = ({db, collection}) => {
  //create queue for update query
  let bulk = db.collection(collection.name).initializeUnorderedBulkOp();

  //retrieve only row with at least one field to anonymize not empty or null
  let fields = collection.fields.map(field => ({ [field.name]: { $exists: true } }));
  db.collection(collection.name).find({ $or: fields }).toArray(function(error, results) {
    if (error) throw error;

    //for each row create an update query to anonymize data
    results.forEach(obj => {

      //only update field with data (if data null or empty, we don't update this field)
      let fieldsAnonymize = {};
      collection.fields.map(field => {
        let fieldValue = obj;
        field.name.split('.').forEach(field => fieldValue && (field in fieldValue) ? fieldValue = fieldValue[field] : {});
        if (!isEmpty(fieldValue)) {
          fieldsAnonymize[field.name] = chance[field.anonymize](field.args || {});
        }
      });
      //add the update query to the queue
      bulk.find( {filter: { _id: obj._id }}).updateOne( { $set : fieldsAnonymize } );
    });
    console.log(BulkHasOperations(bulk));
  });
};


const validateFileSchema = () => {
  const validator = new Validator();
  validator.addSchema(fieldSchema, '/Field');
  validator.addSchema(collectionSchema, '/Collection');
  if(!validator.validate(collections, collectionsSchema).valid) {
    throw new Error("File not valid");
  }
};

const test = async () => {

  //Validate file data
  validateFileSchema();


  await client.connect();
  //TODO: pass db variable
  const db = client.db('buy_tmp');

  //For each collection, anonymize data
  collections.forEach(collection => {

    //create queue for update query
    let bulk = db.collection(collection.name).initializeUnorderedBulkOp();


    //retrieve only row with at least one field to anonymize not empty or null
    anonymize({db, collection}, ((bulk) => {
      console.log('in');
      bulk.execute(function(err, updateResult) {
        console.log(err, updateResult);
      });
    })
  });

};

test();
