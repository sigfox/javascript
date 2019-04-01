import axios from 'axios';

const methods = ['get', 'delete', 'head', 'options', 'post', 'put', 'patch'];

class ApiClient {
  constructor(config) {
    const client = axios.create(config);
    methods.forEach((method) => {
      this[method] = (url, options) => client.request({ url, method, ...options });
    });
  }
}

export default ApiClient;
