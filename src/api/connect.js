/* eslint-disable consistent-return */
import equal from 'fast-deep-equal';

function isRineState(value) {
  return value.__rine === 'state';
}
function getValueFromState(state) {
  return state.get();
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

export function connect(map, func, translate = v => v, noInitialCall = false) {
  let aprops = accumulateProps(map);

  if (noInitialCall === false) {
    func(translate(aprops));
  }

  const unsubscribers = Object.keys(map).map(key => {
    const value = map[key];

    if (isRineState(value)) {
      const state = value;

      return state.subscribe(
        () => {
          const newValue = getValueFromState(state);

          if (!equal(aprops[key], newValue)) {
            func(translate(aprops = { ...aprops, [key]: newValue }));
          }
        }
      );
    }
  }).filter(unsubscribe => !!unsubscribe);

  return () => unsubscribers.forEach(u => u());
}
