'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeChannels = normalizeChannels;
exports.normalizeTo = normalizeTo;
exports.normalizeOptions = normalizeOptions;

var _index = require('../index');

var _constants = require('./constants');

/* eslint-disable no-param-reassign, no-multi-assign */
function normalizeChannels(channels) {
  var stateOp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'READ';

  if (!Array.isArray(channels)) channels = [channels];
  return channels.map(function (ch) {
    if ((0, _index.isState)(ch)) ch = ch[stateOp];
    return (0, _index.isChannel)(ch) ? ch : (0, _index.chan)(ch);
  });
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

function normalizeTo(to) {
  if (typeof to === 'function') {
    return to;
  }
  if ((0, _index.isChannel)(to)) {
    return to.__subFunc || (to.__subFunc = function (v) {
      return (0, _index.sput)(to, v);
    });
  }
  if (typeof to === 'string') {
    var ch = (0, _index.chan)(to, _index.buffer.divorced());
    return ch.__subFunc = function (v) {
      return (0, _index.sput)(to, v);
    };
  }
  throw new Error('\'read\' accepts string, channel or a function as a second argument. ' + to + ' given.');
}
function normalizeOptions(options) {
  options = options || DEFAULT_OPTIONS;
  var transform = options.transform || DEFAULT_OPTIONS.transform;
  var onError = options.onError || DEFAULT_OPTIONS.onError;
  var strategy = options.strategy || _constants.ALL_REQUIRED;
  var listen = 'listen' in options ? options.listen : false;
  var initialCall = 'initialCall' in options ? options.initialCall : DEFAULT_OPTIONS.initialCall;

  return { transform: transform, onError: onError, strategy: strategy, initialCall: initialCall, listen: listen };
}