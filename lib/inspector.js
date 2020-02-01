'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = inspector;
/* eslint-disable no-restricted-globals */
var isDefined = function isDefined(what) {
  return typeof what !== 'undefined';
};
function getOrigin() {
  if (isDefined(location) && isDefined(location.protocol) && isDefined(location.host)) {
    return location.protocol + '//' + location.host;
  }
  return 'unknown';
}

function inspector(logger) {
  return function () {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
    var logSnapshotsToConsole = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    logger.enable();
    logger.on(function (snapshot) {
      if (typeof window !== 'undefined') {
        if (logSnapshotsToConsole) {
          console.log('Riew:inspector', snapshot);
        }
        callback(snapshot);
        window.postMessage({
          type: 'RIEW_SNAPSHOT',
          source: 'riew',
          origin: getOrigin(),
          snapshot: snapshot,
          time: new Date().getTime()
        }, '*');
      }
    });
  };
}