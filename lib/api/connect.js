'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint-disable consistent-return */


exports.connect = connect;

var _fastDeepEqual = require('fast-deep-equal');

var _fastDeepEqual2 = _interopRequireDefault(_fastDeepEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function isRineState(value) {
  return value.__rine === 'state';
}
function getValueFromState(state) {
  return state.get();
}
function accumulateProps(map) {
  return Object.keys(map).reduce(function (props, key) {
    var value = map[key];

    if (isRineState(value)) {
      props[key] = getValueFromState(value);
    } else {
      props[key] = value;
    }
    return props;
  }, {});
}

function connect(map, func) {
  var translate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (v) {
    return v;
  };
  var noInitialCall = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  var aprops = accumulateProps(map);

  if (noInitialCall === false) {
    func(translate(aprops));
  }

  var unsubscribers = Object.keys(map).map(function (key) {
    var value = map[key];

    if (isRineState(value)) {
      var state = value;

      return state.subscribe(function () {
        var newValue = getValueFromState(state);

        if (!(0, _fastDeepEqual2.default)(aprops[key], newValue)) {
          func(translate(aprops = _extends({}, aprops, _defineProperty({}, key, newValue))));
        }
      });
    }
  }).filter(function (unsubscribe) {
    return !!unsubscribe;
  });

  return function () {
    return unsubscribers.forEach(function (u) {
      return u();
    });
  };
}