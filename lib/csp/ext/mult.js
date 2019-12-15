'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mult = mult;
exports.unmult = unmult;
exports.unmultAll = unmultAll;

var _index = require('../index');

function mult(ch, to) {
  if (!ch._taps) ch._taps = [];
  if (!ch._isMultTakerFired) {
    ch._isMultTakerFired = true;
    ch._taps = ch._taps.concat(to);
    (function taker() {
      (0, _index.stake)(ch, function (v) {
        if (v !== _index.CLOSED && v !== _index.ENDED) {
          var numOfSuccessfulPuts = 0;
          var putFinished = function putFinished(chWithSuccessfulPut) {
            numOfSuccessfulPuts += 1;
            if (numOfSuccessfulPuts >= ch._taps.length) {
              taker();
            }
          };
          ch._taps.forEach(function (tapCh, idx) {
            if (ch.state() === _index.OPEN) {
              (0, _index.sput)(tapCh, v, function () {
                return putFinished(tapCh);
              });
            } else {
              numOfSuccessfulPuts += 1;
              ch._taps.splice(idx, 1);
              putFinished();
            }
          });
        }
      });
    })();
  } else {
    to.forEach(function (toCh) {
      if (!ch._taps.find(function (c) {
        return toCh.id === c.id;
      })) {
        ch._taps.push(toCh);
      }
    });
  }
}

function unmult(source, ch) {
  source._taps = (source._taps || []).filter(function (c) {
    return c.id !== ch.id;
  });
}
function unmultAll(ch) {
  ch._taps = [];
}