const { Schema } = require('mongoose');

const mongooseArchive = require('../..');

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String
});

userSchema.statics.factory = function factory(chance) {
  return new this({
    firstname: chance.first(),
    lastname: chance.last(),
    email: chance.email(),
    password: chance.hash()
  });
};

userSchema.plugin(mongooseArchive);

module.exports.userSchema = userSchema;
