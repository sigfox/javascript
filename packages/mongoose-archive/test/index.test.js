/* eslint no-unused-expressions: 0 */
const Chance = require('chance');
const { after, before, describe, it } = require('mocha');
const chai = require('chai');
chai.use(require('chai-http'));

const { startMongo, stopAndClearMongo } = require('./helpers/db');

describe('mongoose-archive', () => {
  let db;
  let user;
  before(async () => {
    const chance = new Chance();
    db = await startMongo();
    user = await db.models.User.factory(chance).save();
  });

  after(async () => {
    await stopAndClearMongo(db);
  });

  describe('archive user', () => {
    before(async () => {
      await user.archive();
    });

    describe('findById', () => {
      it(`finds an archived user`, async () => {
        const userFound = await db.models.User.findById(user._id);
        chai.expect(userFound.isArchived).to.equal(true);
        chai.expect(userFound.archivedAt instanceof Date).to.equal(true);
      });
    });

    describe('find', () => {
      it(`finds nothing`, async () => {
        const usersFound = await db.models.User.find({ email: user.email });
        chai.expect(usersFound).to.be.an('array').that.is.empty;
      });
    });

    describe('findOneAndUpdate', () => {
      it(`updates nothing`, async () => {
        const result = await db.models.User.findOneAndUpdate(
          { email: user.email },
          {
            $set: { firstname: 'foobar' }
          },
          { new: true }
        );
        chai.expect(result).to.be.null;
      });
    });

    describe('findOneAndRemove', () => {
      it(`removes nothing`, async () => {
        await db.models.User.findOneAndRemove({ email: user.email });
        const userFound = await db.models.User.findById(user._id);
        chai.expect(userFound).to.deep.include({ email: user.email });
      });
    });
  });

  describe('restore user', () => {
    before(async () => {
      await user.restore();
    });

    describe('findById', () => {
      it(`finds an archived user`, async () => {
        const userFound = await db.models.User.findById(user._id);
        chai.expect(userFound.isArchived).to.equal(false);
        chai.expect(userFound.archivedAt).to.be.undefined;
      });
    });

    describe('find', () => {
      it(`finds nothing`, async () => {
        const usersFound = await db.models.User.find({ email: user.email });
        chai
          .expect(usersFound)
          .to.be.an('array')
          .that.have.lengthOf(1);
      });
    });

    describe('findOneAndUpdate', () => {
      it(`updates the user`, async () => {
        const result = await db.models.User.findOneAndUpdate(
          { email: user.email },
          {
            $set: { firstname: 'foobar' }
          },
          { new: true }
        );
        chai.expect(result).to.deep.include({ email: user.email, firstname: 'foobar' });
      });
    });

    describe('findOneAndRemove', () => {
      it(`removes the user`, async () => {
        await db.models.User.findOneAndRemove({ email: user.email });
        const userFound = await db.models.User.findById(user._id);
        chai.expect(userFound).to.be.null;
      });
    });
  });
});
