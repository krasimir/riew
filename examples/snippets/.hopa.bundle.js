'use strict';

var riew = require('riew');

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var users = riew.state([]); // Channel for updating the state value.

var add = users.mutate(function reducer(currentUsers, newUser) {
  return [].concat(_toConsumableArray(currentUsers), [newUser]);
}); // Channel for reading the state value.

var getUsers = users.select(function mapping(users) {
  return users.map(function (_ref) {
    var name = _ref.name;
    return name;
  }).join(', ');
});
riew.go(
/*#__PURE__*/
regeneratorRuntime.mark(function A() {
  return regeneratorRuntime.wrap(function A$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return riew.put(add, {
            name: 'Steve',
            age: 24
          });

        case 2:
          _context.next = 4;
          return riew.put(add, {
            name: 'Ana',
            age: 25
          });

        case 4:
          _context.next = 6;
          return riew.put(add, {
            name: 'Peter',
            age: 22
          });

        case 6:
          _context.t0 = console;
          _context.next = 9;
          return riew.take(getUsers);

        case 9:
          _context.t1 = _context.sent;

          _context.t0.log.call(_context.t0, _context.t1);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, A);
}));
