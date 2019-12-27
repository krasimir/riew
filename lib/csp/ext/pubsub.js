'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sub = sub;
exports.unsub = unsub;
exports.unsubAll = unsubAll;
exports.read = read;

var _index = require('../../index');

var _constants = require('../constants');

var _ops = require('../ops');

var _utils = require('../../utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint-disable no-param-reassign, no-multi-assign */


function defaultTransform() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 1) return args[0];
  return args;
}

var NOTHING = Symbol('NOTHING');
var ALL_REQUIRED = Symbol('ALL_REQUIRED');
var ONE_OF = Symbol('ONE_OF');
var DEFAULT_OPTIONS = {
  transform: defaultTransform,
  onError: null,
  initialCall: true
};

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
function normalizeOptions(options) {
  options = options || DEFAULT_OPTIONS;
  var transform = options.transform || DEFAULT_OPTIONS.transform;
  var onError = options.onError || DEFAULT_OPTIONS.onError;
  var strategy = options.strategy || ALL_REQUIRED;
  var once = 'once' in options ? options.once : false;
  var initialCall = 'initialCall' in options ? options.initialCall : DEFAULT_OPTIONS.initialCall;

  return { transform: transform, onError: onError, strategy: strategy, initialCall: initialCall, once: once };
}

function waitAllStrategy(channels, to, options) {
  var transform = options.transform,
      onError = options.onError,
      initialCall = options.initialCall,
      once = options.once;

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
      ch.subscribers.push({ to: to, notify: notify, once: once });
    }
    // If there is already a value in the channel
    // notify the subscribers.
    var currentChannelBufValue = ch.value();
    if (initialCall && currentChannelBufValue.length > 0) {
      notify(currentChannelBufValue[0]);
    }
  });
}

function waitOneStrategy(channels, to, options) {
  var transform = options.transform,
      onError = options.onError,
      initialCall = options.initialCall,
      once = options.once;

  channels.forEach(function (ch) {
    var notify = function notify(value) {
      var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      try {
        if ((0, _utils.isGeneratorFunction)(transform)) {
          (0, _index.go)(transform, function (v) {
            to(v);
            done();
          }, value);
        } else {
          to(transform(value));
          done();
        }
      } catch (e) {
        if (onError === null) {
          throw e;
        }
        onError(e);
      }
    };
    if (!ch.subscribers.find(function (_ref2) {
      var t = _ref2.to;
      return t === to;
    })) {
      ch.subscribers.push({ to: to, notify: notify, once: once });
    }
    // If there is already a value in the channel
    // notify the subscribers.
    var currentChannelBufValue = ch.value();
    if (initialCall && currentChannelBufValue.length > 0) {
      notify(currentChannelBufValue[0]);
    }
  });
}

function sub(channels, to, options) {
  options = normalizeOptions(options);
  var f = void 0;
  switch (options.strategy) {
    case ALL_REQUIRED:
      f = waitAllStrategy;
      break;
    case ONE_OF:
      f = waitOneStrategy;
      break;
    default:
      throw new Error('Subscription strategy not recognized.');
  }
  f(normalizeChannels(channels), normalizeTo(to), options);
}
function unsub(channels, callback) {
  channels = normalizeChannels(channels);
  channels.forEach(function (ch) {
    if ((0, _index.isChannel)(callback)) {
      callback = callback.__subFunc;
    }
    ch.subscribers = ch.subscribers.filter(function (_ref3) {
      var to = _ref3.to;

      if (to !== callback) {
        return true;
      }
      return false;
    });
  });
}
function unsubAll(channels) {
  normalizeChannels(channels).forEach(function (ch) {
    ch.subscribers = [];
  });
}
function read(channels, options) {
  return {
    ch: normalizeChannels(channels),
    op: _constants.READ,
    options: normalizeOptions(options)
  };
}

sub.ALL_REQUIRED = read.ALL_REQUIRED = ALL_REQUIRED;
sub.ONE_OF = read.ONE_OF = ONE_OF;