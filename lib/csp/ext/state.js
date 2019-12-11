'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.state = state;
exports.isState = isState;

var _index = require('../index');

var _utils = require('../../utils');

function state() {
  var value = arguments.length <= 0 ? undefined : arguments[0];
  var id = (0, _utils.getId)('state');
  var readTopics = [];
  var writeTopics = [];
  var isThereInitialValue = arguments.length > 0;
  var api = {
    id: id,
    '@state': true,
    'READ': id + '_READ',
    'WRITE': id + '_WRITE',
    read: function read(topicName) {
      var func = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (v) {
        return v;
      };

      if ((0, _index.topicExists)(topicName)) {
        console.warn('Topic with name ' + topicName + ' already exists.');
        return false;
      }
      readTopics.push({ topicName: topicName, func: func });
      (0, _index.topic)(topicName, null, isThereInitialValue ? func(value) : undefined);
      return true;
    },
    write: function write(topicName) {
      var reducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (_, v) {
        return v;
      };

      if ((0, _index.topicExists)(topicName)) {
        console.warn('Topic with name ' + topicName + ' already exists.');
        return false;
      }
      writeTopics.push({ topicName: topicName });
      (0, _index.sub)(topicName, function (payload) {
        value = reducer(value, payload);
        readTopics.forEach(function (r) {
          (0, _index.pub)(r.topicName, r.func(value));
        });
      });
      return true;
    },
    destroy: function destroy() {
      readTopics.forEach(function (_ref) {
        var topicName = _ref.topicName;
        return (0, _index.halt)(topicName);
      });
      writeTopics.forEach(function (_ref2) {
        var topicName = _ref2.topicName;
        return (0, _index.halt)(topicName);
      });
      value = undefined;
    },
    getValue: function getValue() {
      return value;
    }
  };

  api.read(api.READ);
  api.write(api.WRITE);

  return api;
}

function isState(s) {
  return s && s['@state'] === true;
}