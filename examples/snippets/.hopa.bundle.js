'use strict';

var riew = require('riew');

/* eslint-disable no-unused-vars */
var ch = riew.chan('MYCHANNEL', riew.buffer.dropping(2));
riew.go(
/*#__PURE__*/
regeneratorRuntime.mark(function A() {
  return regeneratorRuntime.wrap(function A$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return riew.put(ch, 'foo');

        case 2:
          _context.next = 4;
          return riew.put(ch, 'bar');

        case 4:
          _context.next = 6;
          return riew.put(ch, 'moo');

        case 6:
          _context.next = 8;
          return riew.put(ch, 'zoo');

        case 8:
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
          return riew.sleep(2000);

        case 2:
          _context2.t0 = console;
          _context2.next = 5;
          return riew.take(ch);

        case 5:
          _context2.t1 = _context2.sent;

          _context2.t0.log.call(_context2.t0, _context2.t1);

          _context2.t2 = console;
          _context2.next = 10;
          return riew.take(ch);

        case 10:
          _context2.t3 = _context2.sent;

          _context2.t2.log.call(_context2.t2, _context2.t3);

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, B);
}));
