'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.state = state;
exports.isState = isState;

var _channel = require('./channel');

var _utils = require('../utils');

function state() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var value = args[0];
  var onChange = [];
  var channels = [];
  var createChannel = function createChannel() {
    var ch = (0, _channel.chan)();
    channels.push(ch);
    return ch;
  };
  var api = {
    '@state': true,
    getState: function getState() {
      return value;
    },
    set: function set() {
      var reducer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (c, v) {
        return v;
      };

      var ch = createChannel();

      ch.subscribe(function (newValue) {
        var result = reducer(value, newValue);

        if ((0, _utils.isPromise)(result)) {
          result.then(function (v) {
            value = v;
            onChange.forEach(function (c) {
              return c(value);
            });
          });
        } else {
          value = result;
          onChange.forEach(function (c) {
            return c(value);
          });
        }
      });
      return ch;
    },
    map: function map() {
      var mapper = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (v) {
        return v;
      };

      var ch = createChannel();

      onChange.push(function (value) {
        ch.put(mapper(value));
      });
      if (args.length > 0) {
        ch.put(mapper(value));
      }
      return ch;
    },
    filter: function filter(_filter) {
      var ch = createChannel();

      onChange.push(function (value) {
        if (_filter(value)) {
          ch.put(value);
        }
      });
      if (_filter(value) && args.length > 0) {
        ch.put(value);
      }
      return ch;
    },
    destroy: function destroy() {
      onChange = [];
      channels.forEach(function (ch) {
        return ch.close();
      });
      channels = [];
    }
  };

  return api;
}

function isState(s) {
  return s && s['@state'] === true;
}