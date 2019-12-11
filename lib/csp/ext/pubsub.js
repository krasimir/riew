'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.topicExists = exports.topic = exports.topics = exports.halt = exports.haltAll = exports.unsubAll = exports.unsub = exports.pub = exports.sub = undefined;

var _index = require('../index');

var PubSub = function PubSub() {
  var channels = {};
  var createTopic = function createTopic(topic, b, initialValue) {
    if (!channels[topic]) {
      channels[topic] = {
        ch: (0, _index.chan)(topic, b || _index.buffer.fixed()),
        subscribers: [],
        listen: false,
        initialValue: initialValue
      };
    }
    return channels[topic].ch;
  };
  var listen = function listen(topic) {
    if (channels[topic] && channels[topic].listen === false) {
      var bus = channels[topic];
      var ch = bus.ch;
      bus.listen = true;
      (function taker() {
        ch.take(function (value) {
          if (value !== _index.chan.CLOSED && value !== _index.chan.ENDED) {
            bus.subscribers = bus.subscribers.filter(function (_ref) {
              var callback = _ref.callback,
                  once = _ref.once;

              callback(value);
              return !once;
            });
            taker();
          }
        });
      })();
    }
  };

  var api = {
    subscribe: function subscribe(topic, callback) {
      var once = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      createTopic(topic);
      if (!channels[topic].subscribers.find(function (_ref2) {
        var c = _ref2.callback;
        return c === callback;
      })) {
        channels[topic].subscribers.push({ callback: callback, once: once });
        if (typeof channels[topic].initialValue !== 'undefined') {
          callback(channels[topic].initialValue);
        }
      }
      listen(topic);
    },
    publish: function publish(topic, payload, callback) {
      createTopic(topic);
      channels[topic].ch.put(payload, callback);
    },
    unsubscribe: function unsubscribe(topic, callback) {
      if (channels[topic]) {
        channels[topic].subscribers = channels[topic].subscribers.filter(function (_ref3) {
          var c = _ref3.callback;
          return c !== callback;
        });
      }
    },
    haltAll: function haltAll() {
      Object.keys(channels).forEach(function (topic) {
        return channels[topic].ch.close();
      });
      channels = {};
    },
    halt: function halt(topic) {
      if (channels[topic]) {
        channels[topic].ch.close();
        delete channels[topic];
      }
    },
    getChannels: function getChannels() {
      return channels;
    },

    topic: createTopic,
    topicExists: function topicExists(topic) {
      return !!channels[topic];
    }
  };

  return api;
};
var ps = PubSub();

var sub = exports.sub = ps.subscribe;
var pub = exports.pub = ps.publish;
var unsub = exports.unsub = ps.unsubscribe;
var unsubAll = exports.unsubAll = ps.unsubscribeAll;
var haltAll = exports.haltAll = ps.haltAll;
var halt = exports.halt = ps.halt;
var topics = exports.topics = ps.getChannels;
var topic = exports.topic = ps.topic;
var topicExists = exports.topicExists = ps.topicExists;