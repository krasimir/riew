'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ONE_OF = exports.ALL_REQUIRED = undefined;
exports.read = read;
exports.sread = sread;
exports.unread = unread;
exports.unreadAll = unreadAll;

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
var ALL_REQUIRED = exports.ALL_REQUIRED = Symbol('ALL_REQUIRED');
var ONE_OF = exports.ONE_OF = Symbol('ONE_OF');
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
  throw new Error('\'read\' accepts string, channel or a function as a second argument. ' + to + ' given.');
}
function normalizeOptions(options) {
  options = options || DEFAULT_OPTIONS;
  var transform = options.transform || DEFAULT_OPTIONS.transform;
  var onError = options.onError || DEFAULT_OPTIONS.onError;
  var strategy = options.strategy || ALL_REQUIRED;
  var listen = 'listen' in options ? options.listen : false;
  var initialCall = 'initialCall' in options ? options.initialCall : DEFAULT_OPTIONS.initialCall;

  return { transform: transform, onError: onError, strategy: strategy, initialCall: initialCall, listen: listen };
}

function waitAllStrategy(channels, to, options) {
  var transform = options.transform,
      onError = options.onError,
      initialCall = options.initialCall,
      listen = options.listen;

  var data = channels.map(function () {
    return NOTHING;
  });
  var composedAlready = false;
  var subscriptions = channels.map(function (ch, idx) {
    var subscription = {};
    var notify = function notify(value) {
      var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      data[idx] = value;
      // Notify the subscriber only if all the sources are fulfilled.
      // In case of one source we don't have to wait.
      if (composedAlready || data.length === 1 || !data.includes(NOTHING)) {
        composedAlready = true;
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
      ch.subscribers.push(subscription = { to: to, notify: notify, listen: listen });
    }
    // If there is already a value in the channel
    // notify the subscribers.
    var currentChannelBufValue = ch.value();
    if (initialCall && currentChannelBufValue.length > 0) {
      notify(currentChannelBufValue[0]);
    }
    return subscription;
  });
  return {
    listen: function listen() {
      subscriptions.forEach(function (s) {
        return s.listen = true;
      });
    }
  };
}
function waitOneStrategy(channels, to, options) {
  var transform = options.transform,
      onError = options.onError,
      initialCall = options.initialCall,
      listen = options.listen;

  var subscriptions = channels.map(function (ch) {
    var subscription = {};
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
      ch.subscribers.push(subscription = { to: to, notify: notify, listen: listen });
    }
    // If there is already a value in the channel
    // notify the subscribers.
    var currentChannelBufValue = ch.value();
    if (initialCall && currentChannelBufValue.length > 0) {
      notify(currentChannelBufValue[0]);
    }
    return subscription;
  });
  return {
    listen: function listen() {
      subscriptions.forEach(function (s) {
        return s.listen = true;
      });
    }
  };
}

function read(channels, options) {
  return {
    ch: normalizeChannels(channels),
    op: _constants.READ,
    options: normalizeOptions(options)
  };
}
function sread(channels, to, options) {
  var f = void 0;
  options = normalizeOptions(options);
  switch (options.strategy) {
    case ALL_REQUIRED:
      f = waitAllStrategy;
      break;
    case ONE_OF:
      f = waitOneStrategy;
      break;
    default:
      throw new Error('Subscription strategy not recognized. Expecting ALL_REQUIRED or ONE_OF but "' + options.strategy + '" given.');
  }
  return f(normalizeChannels(channels), normalizeTo(to), options);
}
function unread(channels, callback) {
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
function unreadAll(channels) {
  normalizeChannels(channels).forEach(function (ch) {
    ch.subscribers = [];
  });
}

read.ALL_REQUIRED = ALL_REQUIRED;
read.ONE_OF = ONE_OF;