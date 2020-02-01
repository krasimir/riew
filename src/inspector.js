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
      if (logSnapshotsToConsole) {
        console.log(snapshot);
      }
      callback(snapshot);
      if (typeof window !== 'undefined') {
        window.postMessage(
          {
            type: 'RIEW_SNAPSHOT',
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
