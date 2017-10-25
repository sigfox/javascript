'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var methods = ['get', 'delete', 'head', 'options', 'post', 'put', 'patch'];

var ApiClient = function ApiClient(config) {
  var _this = this;

  _classCallCheck(this, ApiClient);

  var client = _axios2.default.create(config);
  methods.forEach(function (method) {
    _this[method] = function (url, options) {
      return client.request(_extends({ url: url, method: method }, options));
    };
  });
};

exports.default = ApiClient;
module.exports = exports['default'];