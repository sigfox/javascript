const yargs = require('yargs');
const monganym = require('./../lib');

// eslint-disable-next-line prefer-destructuring
const { url, collections } = yargs
  .usage('$0 <url>', 'anonymize mongodb database in place', ({ positional }) => {
    positional('url', {
      describe: 'mongodb url with the database to anonymize in place',
      type: 'string'
    });
  })
  .alias('help', 'h')
  .config().argv;

(async () => {
  try {
    await monganym(url, { collections });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
