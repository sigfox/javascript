const k8sProbes = require('@sigfox/koa-k8s-probes');
const promMiddleware = require('@sigfox/koa-prometheus');
const Koa = require('koa');

class KoaOps extends Koa {
  constructor({ probes, prometheus } = {}) {
    super();
    this.use(promMiddleware(prometheus));
    this.use(k8sProbes(probes));
  }
}

module.exports = KoaOps;
