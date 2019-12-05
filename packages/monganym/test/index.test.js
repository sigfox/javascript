const { URL } = require('url');
const { describe, it, before, after } = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Chance = require('chance');
const mongoose = require('mongoose');
const monganym = require('./../lib');
const config = require('./config');
const Fixtures = require('./fixtures');

chai.use(chaiAsPromised);

const MONGO_TEST_URL = process.env.MONGO_TEST_URL || `mongodb://localhost:27017/test_db`;

describe('monganym(url, config)', () => {
  before((done) => {
    mongoose.connect(MONGO_TEST_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.once('error', (err) => {
      throw err;
    });
    db.once('open', () => {
      done();
    });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
    });
  });

  describe('with invalid config file', () => {
    it('should throw an error', () =>
      chai
        .expect(monganym(MONGO_TEST_URL, { collections: [] }))
        .to.be.rejectedWith('does not meet minimum length of 1'));
  });

  describe('with missing database in mongodb url', () => {
    it('should throw an error', () => {
      const missingDatabaseURL = new URL(MONGO_TEST_URL);
      missingDatabaseURL.pathname = '';
      return chai
        .expect(monganym(missingDatabaseURL.toString(), config))
        .to.be.rejectedWith('Database needs to specify in the mongodb URL.');
    });
  });

  describe('with valid config file', () => {
    it('should anonymize data', async () => {
      const chance = new Chance('monganym');
      const fixtures = new Fixtures(chance);
      const users = await fixtures.createUsers(20);
      await monganym(MONGO_TEST_URL, config);
      const User = fixtures.UserModel;
      await Promise.all(
        users.map(async (user) => {
          const anonymizedUser = await User.findOne({ _id: user._id });
          chai.expect(anonymizedUser.name).to.not.equal(user.name);
          chai.expect(anonymizedUser.email).to.not.equal(user.email);
          chai.expect(anonymizedUser.address.name).to.not.equal(user.address.name);
          chai.expect(anonymizedUser.address.phone).to.not.equal(user.address.phone);
          chai.expect(anonymizedUser.address.country).to.equal(user.address.country);
        })
      );
    });
  });
});
