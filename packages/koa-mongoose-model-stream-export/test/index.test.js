const Chance = require('chance');
const Koa = require('koa');
const { after, before, describe, it } = require('mocha');
const chai = require('chai');
chai.use(require('chai-http'));
chai.use(require('chai-like'));
chai.use(require('chai-things'));

const { transformUser } = require('./helpers/schema');
const { startMongo, stopAndClearMongo } = require('./helpers/db');
const { mountExportRoutes } = require('./helpers/routes');

const parseStringBuffer = (res, cb) => {
  res.setEncoding('utf8');
  res.data = '';
  res.on('data', (chunk) => {
    res.data += chunk;
  });
  res.on('end', () => cb(null, res.data));
};

describe('koa-mongoose-model-stream-export', () => {
  let app;
  let db;
  let companies;
  let users;

  before(async () => {
    const chance = new Chance();
    db = await startMongo();

    app = new Koa().use(mountExportRoutes(db.models)).callback();

    companies = await Promise.all(
      [...new Array(20)].map(() => db.models.Company.factory(chance).save())
    );
    users = await Promise.all([...new Array(20)].map(() => db.models.User.factory(chance).save()));
  });

  after(async () => {
    await stopAndClearMongo(db);
  });

  describe('exporting companies', () => {
    describe('without specific query', () => {
      it(`returns 200`, async () => {
        const res = await chai
          .request(app)
          .get('/company-schema')
          .buffer()
          .parse(parseStringBuffer);
        chai.expect(res).to.have.status(200);
        chai.expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
        chai.expect(res.body).to.be.a('string');
        JSON.parse(res.body).forEach((company) => {
          chai
            .expect(companies)
            .to.be.an('array')
            .that.contains.something.like(company);
        });
      });
    });

    describe('with query format=csv', () => {
      it(`returns 200`, async () => {
        const res = await chai
          .request(app)
          .get('/company-schema?format=csv')
          .buffer()
          .parse(parseStringBuffer);

        chai.expect(res).to.have.status(200);
        chai.expect(res.headers['content-type']).to.equal('text/csv; charset=utf-8');
        chai.expect(res.body).to.be.a('string');
        res.body
          .replace(/"/g, '')
          .split('\n')
          .forEach((row, index) => {
            if (index > 0 && row.length) {
              const [name, phoneNumber, email, customers, headCount] = row.split(';');
              chai
                .expect(companies)
                .to.be.an('array')
                .that.contains.something.like({
                  name,
                  phoneNumber,
                  email,
                  customers: customers.split(','),
                  headCount: parseInt(headCount, 10)
                });
            }
          });
      });
    });

    describe('with Content-type=text/csv', () => {
      it(`returns 200`, async () => {
        const res = await chai
          .request(app)
          .get('/company-schema')
          .set('Content-type', 'text/csv')
          .buffer()
          .parse(parseStringBuffer);

        chai.expect(res).to.have.status(200);
        chai.expect(res.headers['content-type']).to.equal('text/csv; charset=utf-8');
        chai.expect(res.body).to.be.a('string');
        res.body
          .replace(/"/g, '')
          .split('\n')
          .forEach((row, index) => {
            if (index > 0 && row.length) {
              const [name, phoneNumber, email, customers, headCount] = row.split(';');
              chai
                .expect(companies)
                .to.be.an('array')
                .that.contains.something.like({
                  name,
                  phoneNumber,
                  email,
                  customers: customers.split(','),
                  headCount: parseInt(headCount, 10)
                });
            }
          });
      });
    });
  });

  describe('exporting users', () => {
    describe('without specific query', () => {
      it(`returns 200`, async () => {
        const res = await chai
          .request(app)
          .get('/user-schema')
          .buffer()
          .parse(parseStringBuffer);
        chai.expect(res).to.have.status(200);
        chai.expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
        chai.expect(res.body).to.be.a('string');
        const transformedUsers = users.map(transformUser);
        JSON.parse(res.body).forEach((user) => {
          chai
            .expect(transformedUsers)
            .to.be.an('array')
            .that.contains.something.like(user);
        });
      });
    });

    describe('with query format=csv', () => {
      it(`returns 200`, async () => {
        const res = await chai
          .request(app)
          .get('/user-schema?format=csv')
          .buffer()
          .parse(parseStringBuffer);

        chai.expect(res).to.have.status(200);
        chai.expect(res.headers['content-type']).to.equal('text/csv; charset=utf-8');
        chai.expect(res.body).to.be.a('string');
        const transformedUsers = users.map(transformUser);
        res.body
          .replace(/"/g, '')
          .split('\n')
          .forEach((row, index) => {
            if (index > 0 && row.length) {
              const [firstname, lastname, email] = row.split(';');
              chai
                .expect(transformedUsers)
                .to.be.an('array')
                .that.contains.something.like({
                  firstname,
                  lastname,
                  email
                });
            }
          });
      });
    });

    describe('with Content-type=text/csv', () => {
      it(`returns 200`, async () => {
        const res = await chai
          .request(app)
          .get('/user-schema')
          .set('Content-type', 'text/csv')
          .buffer()
          .parse(parseStringBuffer);

        chai.expect(res).to.have.status(200);
        chai.expect(res.headers['content-type']).to.equal('text/csv; charset=utf-8');
        chai.expect(res.body).to.be.a('string');
        const transformedUsers = users.map(transformUser);
        res.body
          .replace(/"/g, '')
          .split('\n')
          .forEach((row, index) => {
            if (index > 0 && row.length) {
              const [firstname, lastname, email] = row.split(';');
              chai
                .expect(transformedUsers)
                .to.be.an('array')
                .that.contains.something.like({
                  firstname,
                  lastname,
                  email
                });
            }
          });
      });
    });
  });
});
