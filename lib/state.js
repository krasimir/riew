'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEffect = isEffect;
exports.State = State;

var _fastDeepEqual = require('fast-deep-equal');

var _fastDeepEqual2 = _interopRequireDefault(_fastDeepEqual);

var _utils = require('./utils');

var _queue = require('./queue');

var _constants = require('./constants');

var _interfaces = require('./interfaces');

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isEffect(effect) {
  return effect && effect.id && effect.id.substr(0, 1) === 'e';
}

function State(initialValue) {
  var state = {};
  var value = initialValue;
  var active = true;

  state.id = (0, _utils.getId)('s');
  state.get = function () {
    return value;
  };
  state.set = function (newValue) {
    if ((0, _fastDeepEqual2.default)(value, newValue) || active === false) return;
    value = newValue;
    _index.grid.emit(_constants.STATE_VALUE_CHANGE).from(state).with(value);
  };
  state.destroy = function () {
    active = false;
    _index.grid.unsubscribe().from(state);
  };
  state.createEffect = function () {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var effect = function effect() {
      if (active === false) return value;
      var q = (0, _queue.createQueue)(state.get(), state.set);

      _index.grid.subscribe().to(effect).when(_constants.CANCEL_EFFECT, q.cancel);
      effect.items.forEach(function (_ref) {
        var type = _ref.type,
            func = _ref.func;
        return q.add(type, func);
      });
      return q.process.apply(q, arguments);
    };

    effect.id = (0, _utils.getId)('e');
    effect.stateId = state.id;
    effect.items = items;

    (0, _interfaces.implementIterableProtocol)(effect);

    effect.isMutating = function () {
      return !!effect.items.find(function (_ref2) {
        var type = _ref2.type;
        return type === 'mutate';
      });
    };
    effect.destroy = function () {
      (0, _index.cancel)(effect);
      _index.grid.unsubscribe().from(effect);
    };

    Object.keys(_queue.QueueAPI).forEach(function (m) {
      effect[m] = function () {
        for (var _len = arguments.length, methodArgs = Array(_len), _key = 0; _key < _len; _key++) {
          methodArgs[_key] = arguments[_key];
        }

        return (0, _index._fork)(state, effect, { type: m, func: methodArgs });
      };
    });

    return effect;
  };

  return state;
};