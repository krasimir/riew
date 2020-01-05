'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FixedBuffer;

var _Interface = require('./Interface');

var _Interface2 = _interopRequireDefault(_Interface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FixedBuffer() {
  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  var api = (0, _Interface2.default)();

  api.setValue = function (v) {
    return api.value = v;
  };
  api.put = function (item, _callback) {
    if (api.takes.length === 0) {
      if (api.value.length < size) {
        api.value.push(item);
        _callback(true);
      } else {
        api.puts.push({
          callback: function callback(v) {
            api.value.push(item);
            if (api.takes.length > 0) {
              api.takes.shift()(api.value.shift());
            }
            _callback(v || true);
          },
          item: item
        });
      }
    } else {
      api.value.push(item);
      api.takes.shift()(api.value.shift());
      _callback(true);
    }
  };
  api.take = function (callback) {
    if (api.value.length === 0) {
      if (api.puts.length > 0) {
        api.puts.shift().callback();
        api.take(callback);
      } else {
        api.takes.push(callback);
      }
    } else {
      var v = api.value.shift();
      if (api.value.length < size && api.puts.length > 0) {
        api.puts.shift().callback();
      }
      callback(v);
    }
  };

  return api;
}