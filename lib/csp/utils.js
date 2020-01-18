'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeChannels = normalizeChannels;
exports.normalizeTo = normalizeTo;
exports.normalizeOptions = normalizeOptions;

var _index = require('../index');

function normalizeChannels(channels) {
  var stateOp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'READ';

  if (!Array.isArray(channels)) channels = [channels];
  return channels.map(function (ch) {
    if ((0, _index.isState)(ch)) return ch[stateOp];
    return (0, _index.getChannel)(ch);
  });
} /* eslint-disable no-param-reassign, no-multi-assign */


var DEFAULT_OPTIONS = {
  onError: null,
  initialCall: false
};

function normalizeTo(to) {
  if (typeof to === 'function') {
    return to;
  }
  if ((0, _index.isChannel)(to)) {
    return function (v) {
      return (0, _index.sput)(to, v);
    };
  }
  if (_index.CHANNELS.exists(to)) {
    var ch = _index.CHANNELS.get(to);
    return function (v) {
      return (0, _index.sput)(ch, v);
    };
  }
  throw new Error('Channel or a function as a second argument expected. ' + JSON.stringify(to) + ' given.');
}
function normalizeOptions(options) {
  options = options || DEFAULT_OPTIONS;
  var onError = options.onError || DEFAULT_OPTIONS.onError;
  var strategy = options.strategy || _index.ALL_REQUIRED;
  var listen = 'listen' in options ? options.listen : false;
  var read = 'read' in options ? options.read : false;
  var initialCall = 'initialCall' in options ? options.initialCall : DEFAULT_OPTIONS.initialCall;

  return {
    onError: onError,
    strategy: strategy,
    initialCall: initialCall,
    listen: listen,
    read: read,
    userTakeCallback: options.userTakeCallback
  };
}