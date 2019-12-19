'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = EverBuffer;

var _Interface = require('./Interface');

var _Interface2 = _interopRequireDefault(_Interface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EverBuffer() {
  var api = (0, _Interface2.default)();

  if (arguments.length > 0) {
    api.value = [arguments.length <= 0 ? undefined : arguments[0]];
  }
  api.setValue = function (v) {
    return api.value = v;
  };
  api.put = function (item, callback) {
    api.value = [item];
    callback(true);
  };
  api.take = function (callback) {
    callback(api.value[0]);
  };

  return api;
}