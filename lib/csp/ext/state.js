'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createState = createState;
exports.isState = isState;
exports.isStateReadChannel = isStateReadChannel;
exports.isStateWriteChannel = isStateWriteChannel;

var _index = require('../../index');

var _utils = require('../../utils');

function createState() {
  var value = arguments.length <= 0 ? undefined : arguments[0];
  var id = (0, _utils.getId)('state');
  var readChannels = [];
  var writeChannels = [];
  var isThereInitialValue = arguments.length > 0;

  function handleError(onError) {
    return function (e) {
      if (onError !== null) {
        onError(e);
      } else {
        throw e;
      }
    };
  }
  function runSelector(_ref, v) {
    var ch = _ref.ch,
        selector = _ref.selector,
        onError = _ref.onError;

    if ((0, _utils.isGeneratorFunction)(selector)) {
      (0, _index.go)(selector, function (v) {
        return (0, _index.sput)(ch, v);
      }, value);
      return;
    }
    var selectorValue = void 0;
    try {
      selectorValue = selector(v);
    } catch (e) {
      handleError(onError)(e);
    }
    if ((0, _utils.isPromise)(selectorValue)) {
      selectorValue.then(function (v) {
        return (0, _index.sput)(ch, v);
      }).catch(handleError(onError));
    } else {
      (0, _index.sput)(ch, selectorValue);
    }
  }
  function runWriter(_ref2, payload) {
    var ch = _ref2.ch,
        reducer = _ref2.reducer,
        onError = _ref2.onError;

    if ((0, _utils.isGeneratorFunction)(reducer)) {
      (0, _index.go)(reducer, function (v) {
        value = v;
        readChannels.forEach(function (r) {
          return runSelector(r, v);
        });
      }, value, payload);
      return;
    }
    try {
      value = reducer(value, payload);
    } catch (e) {
      handleError(onError)(e);
    }
    if ((0, _utils.isPromise)(value)) {
      value.then(function (v) {
        return readChannels.forEach(function (r) {
          return runSelector(r, v);
        });
      }).catch(handleError(onError));
    } else {
      readChannels.forEach(function (r) {
        return runSelector(r, value);
      });
    }
  }

  var api = {
    id: id,
    '@state': true,
    READ: id + '_read',
    WRITE: id + '_write',
    select: function select(id) {
      var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (v) {
        return v;
      };
      var onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var ch = (0, _index.isChannel)(id) ? id : (0, _index.chan)(id, _index.buffer.ever());
      ch['@statereadchannel'] = true;
      var reader = { ch: ch, selector: selector, onError: onError };
      readChannels.push(reader);
      if (isThereInitialValue) {
        runSelector(reader, value);
      }
      return this;
    },
    mutate: function mutate(id) {
      var reducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (_, v) {
        return v;
      };
      var onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var ch = (0, _index.isChannel)(id) ? id : (0, _index.chan)(id, _index.buffer.ever());
      ch['@statewritechannel'] = true;
      var writer = { ch: ch, reducer: reducer, onError: onError };
      writeChannels.push(writer);
      (0, _index.sub)(ch, function (payload) {
        return runWriter(writer, payload);
      });
      return this;
    },
    destroy: function destroy() {
      readChannels.forEach(function (_ref3) {
        var ch = _ref3.ch;
        return (0, _index.sclose)(ch);
      });
      writeChannels.forEach(function (_ref4) {
        var ch = _ref4.ch;
        return (0, _index.sclose)(ch);
      });
      value = undefined;
      _index.grid.remove(api);
      return this;
    },
    get: function get() {
      return value;
    },
    set: function set(newValue) {
      value = newValue;
      readChannels.forEach(function (r) {
        runSelector(r, value);
      });
      return newValue;
    }
  };

  api.select(api.READ);
  api.mutate(api.WRITE);

  return api;
}

function isState(s) {
  return s && s['@state'] === true;
}
function isStateReadChannel(s) {
  return s && s['@statereadchannel'] === true;
}
function isStateWriteChannel(s) {
  return s && s['@statewritechannel'] === true;
}