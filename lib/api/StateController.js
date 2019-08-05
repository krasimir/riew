'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createStateController;

var _System = require('./System');

var _System2 = _interopRequireDefault(_System);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ids = 0;
var getId = function getId() {
  return 's' + ++ids;
};

function createStateController(initialValue, reducer) {
  var subscribersUID = 0;
  var stateValue = initialValue;
  var subscribers = [];

  var stateController = {
    __rine: 'state',
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
    connect: function connect(update) {
      var subscriberId = ++subscribersUID;

      subscribers.push({ id: subscriberId, update: update });
      return function () {
        subscribers = subscribers.filter(function (_ref2) {
          var id = _ref2.id;
          return id !== subscriberId;
        });
      };
    },
    destroy: function destroy() {
      _System2.default.removeController(this);
    },
    put: function put(type, payload) {
      if (reducer) {
        this.set(reducer(stateValue, { type: type, payload: payload }));
      }
    }
  };

  _System2.default.addController(stateController);

  return stateController;
};