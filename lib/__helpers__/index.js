'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exerciseHTML = exports.delay = undefined;
exports.Test = Test;
exports.exercise = exercise;

var _utils = require('../utils');

var _index = require('../index');

/* eslint-disable max-len */
var cleanHTML = function cleanHTML(html) {
  return html.toString().trim().replace(new RegExp('\\n', 'gi'), '').replace(new RegExp(' {2}', 'g'), '');
};

var delay = exports.delay = function delay() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return new Promise(function (done) {
    return setTimeout(done, time);
  });
};
var exerciseHTML = exports.exerciseHTML = function exerciseHTML(container, expectation) {
  expect(cleanHTML(container.innerHTML)).toEqual(cleanHTML(expectation));
};

function Test() {
  var log = [];

  for (var _len = arguments.length, routines = Array(_len), _key = 0; _key < _len; _key++) {
    routines[_key] = arguments[_key];
  }

  routines.map(function (routine) {
    var rName = (0, _utils.getFuncName)(routine);
    var logSomething = function logSomething(str) {
      return log.push(str);
    };
    log.push('>' + rName);
    (0, _index.go)(routine, function () {
      return log.push('<' + rName);
    }, [logSomething]);
  });
  return log;
}
function exercise(log, expectation, delayInterval) {
  var cleanup = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {};

  if (delayInterval) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        expect(log).toStrictEqual(expectation);
        resolve();
        cleanup();
      }, delayInterval);
    });
  }
  expect(log).toStrictEqual(expectation);
}