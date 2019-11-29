# mongoanym

Anonymize mongodb database using declarative configuration backed by Chance.js to generate deterministic suite of anonymous data.

## Install

```
npm i @sigfox/mongoanym
```

## Usage

### CLI

```
npx mongoanym 192.168.0.5/foo --config examples/foo.json
```

### As a module

```
const mongoanym = require('mongoanym');

await mongoanym(url, config);
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
