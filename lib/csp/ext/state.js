'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createState = createState;
exports.isState = isState;
exports.isStateReadChannel = isStateReadChannel;
exports.isStateWriteChannel = isStateWriteChannel;

var _index = require('../../index');

var _utils = require('../../utils');

function createState() {
  var value = arguments.length <= 0 ? undefined : arguments[0];
  var id = (0, _utils.getId)('state');
  var readChannels = [];
  var writeChannels = [];
  var isThereInitialValue = arguments.length > 0;

  function handleError(onError) {
    return function (e) {
      if (onError === null) {
        throw e;
      }
      onError(e);
    };
  }
  function runSelector(_ref, v) {
    var ch = _ref.ch,
        selector = _ref.selector,
        onError = _ref.onError;

    try {
      if ((0, _utils.isGeneratorFunction)(selector)) {
        (0, _index.go)(selector, function (routineRes) {
          return (0, _index.sput)(ch, routineRes);
        }, value);
        return;
      }
      (0, _index.sput)(ch, selector(v));
    } catch (e) {
      handleError(onError)(e);
    }
  }

  var api = {
    id: id,
    '@state': true,
    READ: id + '_read',
    WRITE: id + '_write',
    select: function select(c) {
      var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (v) {
        return v;
      };
      var onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var ch = (0, _index.isChannel)(c) ? c : (0, _index.chan)(c, _index.buffer.divorced());
      ch['@statereadchannel'] = true;
      var reader = { ch: ch, selector: selector, onError: onError };
      readChannels.push(reader);
      if (isThereInitialValue) {
        runSelector(reader, value);
      }
      return this;
    },
    mutate: function mutate(c) {
      var reducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (_, v) {
        return v;
      };
      var onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var ch = (0, _index.isChannel)(c) ? c : (0, _index.chan)(c, _index.buffer.divorced());
      ch['@statewritechannel'] = true;
      var writer = { ch: ch };
      writeChannels.push(writer);
      (0, _index.sread)(ch, function (v) {
        value = v;
        readChannels.forEach(function (r) {
          return runSelector(r, value);
        });
      }, {
        transform: /*#__PURE__*/regeneratorRuntime.mark(function transform(payload) {
          return regeneratorRuntime.wrap(function transform$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;

                  if (!(0, _utils.isGeneratorFunction)(reducer)) {
                    _context.next = 5;
                    break;
                  }

                  _context.next = 4;
                  return (0, _index.call)(reducer, value, payload);

                case 4:
                  return _context.abrupt('return', _context.sent);

                case 5:
                  return _context.abrupt('return', reducer(value, payload));

                case 8:
                  _context.prev = 8;
                  _context.t0 = _context['catch'](0);

                  handleError(onError)(_context.t0);

                case 11:
                case 'end':
                  return _context.stop();
              }
            }
          }, transform, this, [[0, 8]]);
        }),

        onError: handleError(onError),
        initialCall: true,
        listen: true
      });
      return this;
    },
    destroy: function destroy() {
      readChannels.forEach(function (_ref2) {
        var ch = _ref2.ch;
        return (0, _index.sclose)(ch);
      });
      writeChannels.forEach(function (_ref3) {
        var ch = _ref3.ch;
        return (0, _index.sclose)(ch);
      });
      value = undefined;
      _index.grid.remove(api);
      return this;
    },
    get: function get() {
      return value;
    },
    set: function set(newValue) {
      value = newValue;
      readChannels.forEach(function (r) {
        runSelector(r, value);
      });
      return newValue;
    }
  };

  api.select(api.READ);
  api.mutate(api.WRITE);

  return api;
}

function isState(s) {
  return s && s['@state'] === true;
}
function isStateReadChannel(s) {
  return s && s['@statereadchannel'] === true;
}
function isStateWriteChannel(s) {
  return s && s['@statewritechannel'] === true;
}