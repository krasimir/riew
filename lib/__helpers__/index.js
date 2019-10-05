'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable max-len */

var cleanHTML = function cleanHTML(html) {
  return html.toString().trim().replace(new RegExp('\\n', 'gi'), '').replace(new RegExp(' {2}', 'g'), '');
};

var delay = exports.delay = function delay() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
  return new Promise(function (done) {
    return setTimeout(done, time);
  });
};
var exerciseHTML = exports.exerciseHTML = function exerciseHTML(container, expectation) {
  expect(cleanHTML(container.innerHTML)).toEqual(cleanHTML(expectation));
};