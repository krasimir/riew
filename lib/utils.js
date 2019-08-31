'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isPromise = exports.isPromise = function isPromise(obj) {
  return obj && typeof obj['then'] === 'function';
};
var getFuncName = exports.getFuncName = function getFuncName(func) {
  if (func.name) return func.name;
  var result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString());

  return result ? result[1] : 'unknown';
};
var compose = exports.compose = function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  var isAsync = false;
  var lastResult = void 0;
  var done = function done() {};

  (function loop() {
    if (funcs.length === 0) {
      done(lastResult);return;
    }
    var f = funcs.shift();
    var result = f(lastResult);

    if (isPromise(result)) {
      isAsync = true;
      result.then(function (r) {
        lastResult = r;
        loop();
      });
    } else {
      lastResult = result;
      loop();
    }
  })();

  if (isAsync) {
    return new Promise(function (d) {
      return done = d;
    });
  }
  return lastResult;
};