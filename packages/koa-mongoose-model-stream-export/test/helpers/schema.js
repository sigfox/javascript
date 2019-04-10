const { Schema } = require('mongoose');

const companySchema = new Schema({
  name: String,
  phoneNumber: String,
  email: String,
  secretField: String,
  customers: [String],
  headCount: Number
});

companySchema.statics.factory = function factory(chance) {
  return new this({
    name: chance.name(),
    phoneNumber: chance.phone(),
    email: chance.email(),
    secretField: chance.hash(),
    customers: chance.n(chance.hash, chance.integer({ min: 1, max: 10 }), { length: 24 }),
    headCount: chance.integer({ min: 1, max: 500 })
  });
};

companySchema.statics.EXPORT_FIELDS = ['name', 'phoneNumber', 'email', 'customers', 'headCount'];

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

const transformUser = user => ({
  firstname: `${user.firstname.charAt(0)}${user.firstname.substr(1)}`,
  lastname: user.lastname.toUpperCase(),
  email: user.email
});

userSchema.statics.transformForExport = transformUser;

userSchema.statics.EXPORT_FIELDS = ['firstname', 'lastname', 'email'];

module.exports.transformUser = transformUser;

module.exports.companySchema = companySchema;
module.exports.userSchema = userSchema;
