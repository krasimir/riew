"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sub = sub;
exports.subOnce = subOnce;
exports.unsub = unsub;
exports.read = read;

var _index = require("../../index");

var _constants = require("../constants");

var _ops = require("../ops");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var NOTHING = Symbol("Nothing");

function normalizeChannels(channels) {
  if (!Array.isArray(channels)) channels = [channels];
  return channels.map(function (ch, idx) {
    if ((0, _index.isState)(ch)) ch = ch.READ;
    return (0, _index.isChannel)(ch) ? ch : (0, _index.chan)(ch);
  });
}
function normalizeTo(to) {
  if (typeof to === "function") {
    return to;
  } else if ((0, _index.isChannel)(to)) {
    return to.__subFunc || (to.__subFunc = function (v) {
      return (0, _ops.sput)(to, v);
    });
  } else if (typeof to === "string") {
    var ch = (0, _index.chan)(to, _index.buffer.ever());
    return ch.__subFunc = function (v) {
      return (0, _ops.sput)(to, v);
    };
  }
  throw new Error("'sub' accepts string, channel or a function as a second argument. " + to + " given.");
}
function defaultTransform() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 1) return args[0];
  return args;
}

function sub(channels, to) {
  var transform = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultTransform;
  var initialCallIfBufValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  // in a routine
  if (typeof to === "undefined") {
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
      data[idx] = value;
      if (composedAtLeastOnce || data.length === 1 || !data.includes(NOTHING)) {
        composedAtLeastOnce = true;
        to(transform.apply(undefined, _toConsumableArray(data)));
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
    if (initialCallIfBufValue && currentChannelBufValue.length > 0) {
      notify(currentChannelBufValue[0]);
    }
  });
  return to;
}

function subOnce(id, callback) {
  var ch = (0, _index.isChannel)(id) ? id : (0, _index.chan)(id);
  var c = function c(v) {
    unsub(id, callback);
    callback(v);
  };
  if (!ch.subscribers.find(function (s) {
    return s === c;
  })) {
    ch.subscribers.push({ notify: c, to: callback });
  }
}
function unsub(id, callback) {
  var ch = (0, _index.isChannel)(id) ? id : (0, _index.chan)(id);
  ch.subscribers = ch.subscribers.filter(function (_ref2) {
    var to = _ref2.to;

    if (to !== callback) {
      return true;
    }
    return false;
  });
}

function read() {
  return sub.apply(undefined, arguments);
}