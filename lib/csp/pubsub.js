'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitAllStrategy = waitAllStrategy;
exports.waitOneStrategy = waitOneStrategy;

var _index = require('../index');

var _constants = require('./constants');

var _utils = require('../utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint-disable no-param-reassign, no-multi-assign */


function waitAllStrategy(channels, to, options) {
  var transform = options.transform,
      onError = options.onError,
      initialCall = options.initialCall,
      listen = options.listen;

  var data = channels.map(function () {
    return _constants.NOTHING;
  });
  var composedAlready = false;
  var subscriptions = channels.map(function (ch, idx) {
    var subscription = {};
    var notify = function notify(value) {
      var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      data[idx] = value;
      // Notify the subscriber only if all the sources are fulfilled.
      // In case of one source we don't have to wait.
      if (composedAlready || data.length === 1 || !data.includes(_constants.NOTHING)) {
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