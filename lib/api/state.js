'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isState = exports.teardownAction = undefined;
exports.default = createState;

var _System = require('./System');

var _System2 = _interopRequireDefault(_System);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function createState(initialValue, reducer) {
  var subscribersUID = 0;
  var stateValue = initialValue;
  var subscribers = [];

  var state = {
    __rine: 'state',
    __subscribers: function __subscribers() {
      return subscribers;
    },

    id: getId(),
    set: function set(newValue) {
      stateValue = newValue;
      subscribers.forEach(function (_ref) {
        var update = _ref.update;
        return update(stateValue);
      });
    },
    get: function get() {
      return stateValue;
    },
    subscribe: function subscribe(update) {
      var subscriberId = ++subscribersUID;

      subscribers.push({ id: subscriberId, update: update });
      return function () {
        subscribers = subscribers.filter(function (_ref2) {
          var id = _ref2.id;
          return id !== subscriberId;
        });
      };
    },
    teardown: function teardown() {
      subscribers = [];
      stateValue = undefined;
    },
    put: function put(type, payload) {
      if (reducer) {
        this.set(reducer(stateValue, { type: type, payload: payload }));
      }
    }
  };

  _System2.default.addTask(teardownAction(state.id), function () {
    state.teardown();
  });

  return state;
};