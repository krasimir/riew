'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = state;

var _index = require('../index');

var _utils = require('../utils');

function state() {
  var value = arguments.length <= 0 ? undefined : arguments[0];
  var id = (0, _utils.getId)('state');
  var readChannels = [];
  var writeChannels = [];
  var isThereInitialValue = arguments.length > 0;
  var READ_CHANNEL = id + '_read';
  var WRITE_CHANNEL = id + '_write';

  function handleError(onError) {
    return function (e) {
      if (onError === null) {
        throw e;
      }
      onError(e);
    };
  }
  function runReader(_ref, v) {
    var ch = _ref.ch,
        selector = _ref.selector,
        onError = _ref.onError;

    try {
      if ((0, _utils.isGeneratorFunction)(selector)) {
        (0, _index.go)(selector, function (routineRes) {
          return (0, _index.sput)(ch, routineRes);
        }, value);
        return;
      }
      (0, _index.sput)(ch, selector(v));
    } catch (e) {
      handleError(onError)(e);
    }
  }

  var api = {
    id: id,
    '@state': true,
    children: function children() {
      return readChannels.map(function (_ref2) {
        var ch = _ref2.ch;
        return ch;
      }).concat(writeChannels.map(function (_ref3) {
        var ch = _ref3.ch;
        return ch;
      }));
    },

    READ: (0, _index.chan)(READ_CHANNEL, _index.buffer.sliding()),
    WRITE: (0, _index.chan)(WRITE_CHANNEL, _index.buffer.sliding()),
    select: function select(c) {
      var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (v) {
        return v;
      };
      var onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var ch = (0, _index.isChannel)(c) ? c : (0, _index.chan)(c, _index.buffer.sliding());
      ch['@statereadchannel'] = true;
      var reader = { ch: ch, selector: selector, onError: onError };
      readChannels.push(reader);
      if (isThereInitialValue) {
        runReader(reader, value);
      }
      return this;
    },
    mutate: function mutate(c) {
      var reducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (_, v) {
        return v;
      };
      var onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var ch = (0, _index.isChannel)(c) ? c : (0, _index.chan)(c, _index.buffer.sliding());
      ch['@statewritechannel'] = true;
      var writer = { ch: ch };
      writeChannels.push(writer);
      ch.beforePut(function (payload, resolveBeforePutHook) {
        try {
          if ((0, _utils.isGeneratorFunction)(reducer)) {
            (0, _index.go)(reducer, function (genResult) {
              value = genResult;
              readChannels.forEach(function (r) {
                return runReader(r, value);
              });
              resolveBeforePutHook(value);
              _index.logger.log(api, 'STATE_VALUE_SET', value);
            }, value, payload);
            return;
          }
          value = reducer(value, payload);
          readChannels.forEach(function (r) {
            return runReader(r, value);
          });
          resolveBeforePutHook(value);
          _index.logger.log(api, 'STATE_VALUE_SET', value);
        } catch (e) {
          handleError(onError)(e);
        }
      });
      return this;
    },
    destroy: function destroy() {
      readChannels.forEach(function (_ref4) {
        var ch = _ref4.ch;
        return (0, _index.sclose)(ch);
      });
      writeChannels.forEach(function (_ref5) {
        var ch = _ref5.ch;
        return (0, _index.sclose)(ch);
      });
      value = undefined;
      _index.grid.remove(api);
      _index.logger.log(api, 'STATE_DESTROYED');
      return this;
    },
    get: function get() {
      return value;
    },
    set: function set(newValue) {
      value = newValue;
      readChannels.forEach(function (r) {
        runReader(r, value);
      });
      _index.logger.log(api, 'STATE_VALUE_SET', newValue);
      return newValue;
    }
  };

  api.select(api.READ);
  api.mutate(api.WRITE);

  _index.grid.add(api);
  _index.logger.log(api, 'STATE_CREATED');

  return api;
}