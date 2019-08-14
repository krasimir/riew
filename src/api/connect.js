/* eslint-disable consistent-return */
import equal from 'fast-deep-equal';

function isRineState(value) {
  return value.__rine === 'state';
}
function getValueFromState(s) {
  return s();
}
function accumulateProps(map) {
  return Object.keys(map).reduce((props, key) => {
    const value = map[key];

    if (isRineState(value)) {
      props[key] = getValueFromState(value);
    } else {
      props[key] = value;
    }
    return props;
  }, {});
}

export default function connect(map, func, noInitialCall = false) {
  let aprops = accumulateProps(map);

  if (noInitialCall === false) {
    func(aprops);
  }

  const unsubscribers = Object.keys(map).map(key => {
    const value = map[key];

    if (isRineState(value)) {
      const stateInstance = value;

      return stateInstance.subscribe(
        () => {
          const newValue = getValueFromState(stateInstance);

          if (!equal(aprops[key], newValue)) {
            func(aprops = { ...aprops, [key]: newValue });
          }
        }
      );
    }
  }).filter(unsubscribe => !!unsubscribe);

  return () => unsubscribers.forEach(u => u());
}
