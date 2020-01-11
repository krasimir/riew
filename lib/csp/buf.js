'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

var _index = require('../index');

/* eslint-disable no-param-reassign */
var DEFAULT_OPTIONS = { dropping: false, sliding: false, memory: false };
var NOOP = function NOOP(v, cb) {
  return cb(v);
};

function CSPBuffer() {
  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_OPTIONS,
      dropping = _ref.dropping,
      sliding = _ref.sliding,
      memory = _ref.memory;

  var api = {
    value: [],
    puts: [],
    takes: [],
    hooks: {
      beforePut: NOOP,
      afterPut: NOOP,
      beforeTake: function beforeTake(cb) {
        return cb();
      },
      afterTake: NOOP
    },
    parent: null
  };

  api.beforePut = function (hook) {
    return api.hooks.beforePut = hook;
  };
  api.afterPut = function (hook) {
    return api.hooks.afterPut = hook;
  };
  api.beforeTake = function (hook) {
    return api.hooks.beforeTake = hook;
  };
  api.afterTake = function (hook) {
    return api.hooks.afterTake = hook;
  };
  api.isEmpty = function () {
    return api.value.length === 0;
  };
  api.reset = function () {
    api.value = [];
    api.puts = [];
    api.takes = [];
  };
  api.setValue = function (v) {
    api.value = v;
  };
  api.getValue = function () {
    return api.value;
  };
  api.decomposeTakers = function () {
    return api.takes.reduce(function (res, takeObj) {
      res[takeObj.options.read ? 'readers' : 'takers'].push(takeObj);
      return res;
    }, {
      readers: [],
      takers: []
    });
  };
  api.consumeTake = function (takeObj, value) {
    if (!takeObj.options.listen) {
      var idx = api.takes.findIndex(function (t) {
        return t === takeObj;
      });
      if (idx >= 0) api.takes.splice(idx, 1);
    }
    takeObj.callback(value);
  };
  api.deleteReader = function (cb) {
    var idx = api.takes.findIndex(function (_ref2) {
      var callback = _ref2.callback;
      return callback === cb;
    });
    if (idx >= 0) {
      api.takes.splice(idx, 1);
    }
  };
  api.deleteReaders = function () {
    api.takes = api.takes.filter(function (_ref3) {
      var options = _ref3.options;
      return !options.read;
    });
  };

  api.setValue = function (v) {
    return api.value = v;
  };

  var put = function put(item, _callback) {
    var _api$decomposeTakers = api.decomposeTakers(),
        readers = _api$decomposeTakers.readers,
        takers = _api$decomposeTakers.takers;
    // console.log(
    //   `put=${item}`,
    //   `readers=${readers.length}`,
    //   `takers=${takers.length}`,
    //   `value=${api.value.length} size=${size}`
    // );

    // resolving readers


    readers.forEach(function (reader) {
      return api.consumeTake(reader, item);
    });

    // resolving takers
    if (memory) {
      api.value = [item];
      _callback(true);
      if (takers.length > 0) {
        api.consumeTake(takers[0], item);
      }
      return;
    }
    if (takers.length > 0) {
      api.consumeTake(takers[0], item);
      _callback(true);
    } else {
      if (api.value.length < size) {
        api.value.push(item);
        _callback(true);
        return;
      }
      if (dropping) {
        _callback(false);
        return;
      }
      if (sliding) {
        api.value.shift();
        api.value.push(item);
        _callback(true);
        return;
      }
      api.puts.push({
        callback: function callback(v) {
          api.value.push(item);
          _callback(v || true);
        },
        item: item
      });
    }
  };

  var take = function take(callback, options) {
    // console.log('take', `puts=${api.puts.length}`, `value=${api.value.length}`);
    options = (0, _utils.normalizeOptions)(options);
    if (api.value.length === 0) {
      if (api.puts.length > 0 && !options.read) {
        api.puts.shift().callback();
        callback(api.value.shift());
      } else {
        api.takes.push({ callback: callback, options: options });
        return function () {
          return api.deleteReader(callback);
        };
      }
    } else if (memory) {
      callback(api.value[0]);
      if (options.listen) {
        api.takes.push({ callback: callback, options: options });
        return function () {
          return api.deleteReader(callback);
        };
      }
    } else if (options.read) {
      callback(api.value[0]);
    } else {
      var v = api.value.shift();
      callback(v);
      if (api.value.length < size && api.puts.length > 0) {
        api.puts.shift().callback();
      }
    }
    return function () {};
  };

  api.put = function (item, callback) {
    if (__DEV__) _index.logger.log({ id: api.parent }, 'CHANNEL_PUT_INITIATED', item);
    return api.hooks.beforePut(item, function (beforePutRes) {
      return put(beforePutRes, function (putOpRes) {
        return api.hooks.afterPut(putOpRes, function (res) {
          if (__DEV__) _index.logger.log({ id: api.parent }, 'CHANNEL_PUT_RESOLVED', res);
          callback(res);
        });
      });
    });
  };
  api.take = function (callback, options) {
    if (__DEV__) _index.logger.log({ id: api.parent }, 'CHANNEL_TAKE_INITIATED');
    return api.hooks.beforeTake(function () {
      return take(function (takeOpRes) {
        return api.hooks.afterTake(takeOpRes, function () {
          for (var _len = arguments.length, res = Array(_len), _key = 0; _key < _len; _key++) {
            res[_key] = arguments[_key];
          }

          if (__DEV__) _index.logger.log({ id: api.parent }, 'CHANNEL_TAKE_RESOLVED', res);
          callback.apply(undefined, res);
        });
      }, options);
    });
  };

  return api;
}

var buffer = {
  fixed: CSPBuffer,
  dropping: function dropping() {
    var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    if (size < 1) {
      throw new Error('The dropping buffer should have at least size of one.');
    }
    return CSPBuffer(size, { dropping: true });
  },
  sliding: function sliding() {
    var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    if (size < 1) {
      throw new Error('The sliding buffer should have at least size of one.');
    }
    return CSPBuffer(size, { sliding: true });
  },
  memory: function memory() {
    return CSPBuffer(0, { memory: true });
  }
};

exports.default = buffer;