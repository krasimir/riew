'use strict';

var riew = require('riew');

/* eslint-disable no-unused-vars */
var ch = riew.chan();
riew.go(
/*#__PURE__*/
regeneratorRuntime.mark(function A() {
  var name;
  return regeneratorRuntime.wrap(function A$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return riew.take(ch);

        case 2:
          name = _context.sent;
          _context.next = 5;
          return riew.put(ch, "Hey ".concat(name, ", how are you?"));

        case 5:
        case "end":
          return _context.stop();
      }
    }
  }, A);
}));
riew.go(
/*#__PURE__*/
regeneratorRuntime.mark(function B() {
  return regeneratorRuntime.wrap(function B$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return riew.put(ch, 'Steve');

        case 2:
          _context2.t0 = console;
          _context2.next = 5;
          return riew.take(ch);

        case 5:
          _context2.t1 = _context2.sent;

          _context2.t0.log.call(_context2.t0, _context2.t1);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  }, B);
}));
