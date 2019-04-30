# universal-api-client

Simple promisified http client to send requests

## Features

Send http request:

- POST
- GET
- PUT
- PATCH
- DELETE
- HEAD
- OPTIONS

## Install

```bash
npm install @sigfox/universal-api-client
```

## Usage

```javascript
const ApiClient = require('@sigfox/universal-api-client');

const apiClient = new ApiClient({ baseURL: '/api' });

const getData = client => client.get('/data');

const postData = (client, data) => client.post('/data', data);

getData(client).then(response => {
  // use response here
});

postData(client, { lifePurpose: 42 }).then(response => {
  // use response here
});

// and so on...
```

## Test

```bash
npm test
```

## Licence

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sigfox/javascript/blob/master/LICENSE) file for details.
