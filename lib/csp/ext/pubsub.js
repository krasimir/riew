'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sub = sub;
exports.unsub = unsub;
exports.subOnce = subOnce;
exports.unsubAll = unsubAll;
exports.read = read;

var _index = require('../../index');

var _constants = require('../constants');

var _ops = require('../ops');

var _utils = require('../../utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint-disable no-param-reassign */


var NOTHING = Symbol('Nothing');

function normalizeChannels(channels) {
  if (!Array.isArray(channels)) channels = [channels];
  return channels.map(function (ch) {
    if ((0, _index.isState)(ch)) ch = ch.READ;
    return (0, _index.isChannel)(ch) ? ch : (0, _index.chan)(ch);
  });
}
function normalizeTo(to) {
  if (typeof to === 'function') {
    return to;
  }
  if ((0, _index.isChannel)(to)) {
    return to.__subFunc || (to.__subFunc = function (v) {
      return (0, _ops.sput)(to, v);
    });
  }
  if (typeof to === 'string') {
    var ch = (0, _index.chan)(to, _index.buffer.divorced());
    return ch.__subFunc = function (v) {
      return (0, _ops.sput)(to, v);
    };
  }
  throw new Error('\'sub\' accepts string, channel or a function as a second argument. ' + to + ' given.');
}
function defaultTransform() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 1) return args[0];
  return args;
}

var DEFAULT_OPTIONS = {
  transform: defaultTransform,
  onError: null,
  initialCall: true
};

function sub(channels, to, options) {
  options = options || DEFAULT_OPTIONS;
  var transform = options.transform || DEFAULT_OPTIONS.transform;
  var onError = options.onError || DEFAULT_OPTIONS.onError;
  var initialCall = 'initialCall' in options ? options.initialCall : DEFAULT_OPTIONS.initialCall;

  // in a routine
  if (typeof to === 'undefined') {
    return { ch: channels, op: _constants.SUB };
  }

  // outside routine
  channels = normalizeChannels(channels); // array of channels
  to = normalizeTo(to); // function

  var data = channels.map(function () {
    return NOTHING;
  });
  var composedAtLeastOnce = false;
  channels.forEach(function (ch, idx) {
    var notify = function notify(value) {
      var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      data[idx] = value;
      // Notify the subscriber only if all the sources are fulfilled.
      // In case of one source we don't have to wait.
      if (composedAtLeastOnce || data.length === 1 || !data.includes(NOTHING)) {
        composedAtLeastOnce = true;
        try {
          if ((0, _utils.isGeneratorFunction)(transform)) {
            (0, _index.go)(transform, function (v) {
              to(v);
              done();
            }, value);
          } else {
            to(transform.apply(undefined, _toConsumableArray(data)));
            done();
          }
        } catch (e) {
          if (onError === null) {
            throw e;
          }
          onError(e);
        }
      }
    };
    if (!ch.subscribers.find(function (_ref) {
      var t = _ref.to;
      return t === to;
    })) {
      ch.subscribers.push({ to: to, notify: notify });
    }
    // If there is already a value in the channel
    // notify the subscribers.
    var currentChannelBufValue = ch.value();
    if (initialCall && currentChannelBufValue.length > 0) {
      notify(currentChannelBufValue[0]);
    }
  });
  return to;
}
function unsub(id, callback) {
  var ch = (0, _index.isChannel)(id) ? id : (0, _index.chan)(id);
  if ((0, _index.isChannel)(callback)) {
    callback = callback.__subFunc;
  }
  ch.subscribers = ch.subscribers.filter(function (_ref2) {
    var to = _ref2.to;

    if (to !== callback) {
      return true;
    }
    return false;
  });
}
function subOnce(channel, callback) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_OPTIONS;

  var c = function c(v) {
    unsub(channel, c);
    if (!(0, _index.isChannel)(callback)) {
      callback(v);
    } else {
      (0, _ops.sput)(callback, v);
    }
  };
  sub(channel, c, options);
}
function unsubAll(id) {
  var ch = (0, _index.isChannel)(id) ? id : (0, _index.chan)(id);
  ch.subscribers = [];
}
function read() {
  return sub.apply(undefined, arguments);
}