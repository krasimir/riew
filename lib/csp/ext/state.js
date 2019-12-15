'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.state = state;
exports.isState = isState;

var _index = require('../../index');

var _utils = require('../../utils');

function state() {
  var value = arguments.length <= 0 ? undefined : arguments[0];
  var id = (0, _utils.getId)('state');
  var readChannels = [];
  var writeChannels = [];
  var isThereInitialValue = arguments.length > 0;

  function verifyChannel(id) {
    if (_index.CHANNELS.exists(id)) {
      throw new Error('Channel with name ' + id + ' already exists.');
    }
  }

  var api = {
    id: id,
    '@state': true,
    'READ': id + '_read',
    'WRITE': id + '_write',
    select: function select(id) {
      var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (v) {
        return v;
      };

      verifyChannel(id);
      var ch = (0, _index.chan)(id, _index.buffer.ever());
      readChannels.push({ ch: ch, selector: selector });
      if (isThereInitialValue) {
        (0, _index.sput)(ch, selector(value));
      }
    },
    mutate: function mutate(id) {
      var reducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (_, v) {
        return v;
      };

      verifyChannel(id);
      var ch = (0, _index.chan)(id, _index.buffer.ever());
      writeChannels.push({ ch: ch });
      (0, _index.sub)(ch, function (payload) {
        value = reducer(value, payload);
        if ((0, _utils.isPromise)(value)) {
          value.then(function (v) {
            readChannels.forEach(function (r) {
              (0, _index.sput)(r.ch, r.selector(v));
            });
          });
        } else {
          readChannels.forEach(function (r) {
            (0, _index.sput)(r.ch, r.selector(value));
          });
        }
      });
    },
    destroy: function destroy() {
      readChannels.forEach(function (_ref) {
        var ch = _ref.ch;
        return (0, _index.sclose)(ch);
      });
      writeChannels.forEach(function (_ref2) {
        var ch = _ref2.ch;
        return (0, _index.sclose)(ch);
      });
      value = undefined;
      _index.grid.remove(api);
    },
    get: function get() {
      return value;
    },
    set: function set(newValue) {
      value = newValue;
      readChannels.forEach(function (r) {
        return (0, _index.sput)(r.ch, r.selector(value));
      });
    }
  };

  api.select(api.READ);
  api.mutate(api.WRITE);

  _index.grid.add(api);
  return api;
}

function isState(s) {
  return s && s['@state'] === true;
}