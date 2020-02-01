/* eslint-disable no-restricted-globals */
const isDefined = what => typeof what !== 'undefined';
function getOrigin() {
  if (
    isDefined(location) &&
    isDefined(location.protocol) &&
    isDefined(location.host)
  ) {
    return `${location.protocol}//${location.host}`;
  }
  return 'unknown';
}

export default function inspector(logger) {
  return (callback = () => {}, logSnapshotsToConsole = false) => {
    logger.enable();
    logger.on(snapshot => {
      if (typeof window !== 'undefined') {
        if (logSnapshotsToConsole) {
          console.log('Riew:inspector', snapshot);
        }
        callback(snapshot);
        window.postMessage(
          {
            type: 'RIEW_SNAPSHOT',
            source: 'riew',
            origin: getOrigin(),
            snapshot,
            time: new Date().getTime(),
          },
          '*'
        );
      }
    });
  };
}
