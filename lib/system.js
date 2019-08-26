'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function normalizeState(state) {
  var value = state.__get();
  var queues = state.__queues().map(function (q) {
    return {
      index: q.index,
      result: q.result,
      items: q.items.map(function (_ref) {
        var type = _ref.type,
            name = _ref.name;
        return name.join(',') + '(' + type + ')';
      })
    };
  });

  return { value: value, queues: queues };
};

var System = {
  __states: [],
  onStateCreated: function onStateCreated(state) {
    this.__states.push(state);
  },
  onStateTeardown: function onStateTeardown(state) {
    this.__states = this.__states.filter(function (_ref2) {
      var id = _ref2.id;
      return id === state.id;
    });
  },
  snapshot: function snapshot() {
    return this.__states.map(normalizeState);
  }
};

exports.default = System;