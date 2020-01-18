'use strict';

var riew = require('riew');

/* eslint-disable no-unused-vars */
var ch = riew.chan();
riew.sread(ch, function (value) {
  console.log(value);
});
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
        case "end":
          return _context.stop();
      }
    }
  }, A);
}));
