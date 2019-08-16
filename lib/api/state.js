'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isState = exports.teardownAction = undefined;
exports.default = createState;

var _System = require('./System');

var _System2 = _interopRequireDefault(_System);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-use-before-define, no-return-assign */
var ids = 0;
var getId = function getId() {
  return '@@s' + ++ids;
};

var teardownAction = exports.teardownAction = function teardownAction(id) {
  return id + '_teardown';
};
var isState = exports.isState = function isState(state) {
  return state && state.__rine === 'state';
};

function createState(initialValue) {
  var subscribersUID = 0;
  var stateValue = initialValue;
  var subscribers = [];
  var reducerTasks = [];
  var mutations = [];
  var mutationInProgress = false;

  var state = function state(newValue) {
    if (typeof newValue !== 'undefined') {
      state.set(newValue);
    }
    return state.get();
  };
  var doneMutation = function doneMutation(value) {
    state.set(value);
    mutationInProgress = false;
    processMutations();
  };
  var processMutations = function processMutations() {
    if (mutations.length === 0 || mutationInProgress) return;
    mutationInProgress = true;

    var _mutations$shift = mutations.shift(),
        reducer = _mutations$shift.reducer,
        payload = _mutations$shift.payload,
        done = _mutations$shift.done;

    var result = reducer(stateValue, payload);

    if ((0, _utils.isPromise)(result)) {
      result.then(function (value) {
        done(value);
        doneMutation(value);
      });
    } else {
      done(result);
      doneMutation(result);
    }
  };

  state.__rine = 'state';
  state.__subscribers = function () {
    return subscribers;
  };
  state.id = getId();
  state.set = function (newValue) {
    stateValue = newValue;
    subscribers.forEach(function (_ref) {
      var update = _ref.update;
      return update(stateValue);
    });
    return newValue;
  };
  state.get = function () {
    return stateValue;
  };
  state.subscribe = function (update) {
    var subscriberId = ++subscribersUID;

    subscribers.push({ id: subscriberId, update: update });
    return function () {
      subscribers = subscribers.filter(function (_ref2) {
        var id = _ref2.id;
        return id !== subscriberId;
      });
    };
  };
  state.teardown = function () {
    _System2.default.put(teardownAction(state.id));
  };
  state.mutation = function (reducer) {
    for (var _len = arguments.length, types = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      types[_key - 1] = arguments[_key];
    }

    if (types.length > 0) {
      types.forEach(function (type) {
        reducerTasks.push(_System2.default.takeEvery(type, function (payload) {
          mutations.push({ reducer: reducer, payload: payload, done: function done() {} });
          processMutations();
        }));
      });
    }
    return function (payload) {
      return new Promise(function (done) {
        mutations.push({ reducer: reducer, payload: payload, done: done });
        processMutations();
      });
    };
  };

  _System2.default.addTask(teardownAction(state.id), function () {
    subscribers = [];
    stateValue = undefined;
    if (reducerTasks.length > 0) {
      reducerTasks.forEach(function (t) {
        return t.cancel();
      });
    }
  });

  return state;
};