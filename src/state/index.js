import equal from 'fast-deep-equal';

import createEffect from './effect';
import { getId } from '../utils';
import { gridAddState, gridDestroy } from '../grid';

function State(initialValue) {
  const s = {};
  let value = initialValue;
  let listeners = [];

  s.id = getId('s');
  s.triggerListeners = () => {
    listeners.forEach(l => l());
  };

  s.get = () => value;
  s.set = (newValue) => {
    let isEqual = equal(value, newValue);

    value = newValue;
    if (!isEqual) s.triggerListeners();
  };
  s.teardown = () => {
    listeners = [];
    gridDestroy(s.id);
  };
  s.listeners = () => listeners;
  s.addListener = (effect) => {
    listeners.push(effect);
  };
  s.removeListener = (effect) => {
    listeners = listeners.filter(({ id }) => id !== effect.id);
  };

  gridAddState(s);

  return s;
};

export function createState(initialValue) {
  return createEffect(State(initialValue))();
};

export function mergeStates(statesMap) {
  const fetchSourceValues = () => Object.keys(statesMap).reduce((result, key) => {
    const [ s ] = statesMap[key];

    result[key] = s();
    return result;
  }, {});
  const effect = createState();

  effect.state.get = fetchSourceValues;
  effect.state.set = newValue => {
    if (typeof newValue !== 'object') {
      throw new Error('Wrong merged state value. Must be key-value pairs.');
    }
    Object.keys(newValue).forEach(key => {
      if (!statesMap[key]) {
        throw new Error(`There is no state with key "${ key }".`);
      }
      const [ getChildState, setChildState ] = statesMap[key];

      if (!equal(newValue[key], getChildState())) {
        setChildState(newValue[key]);
      }
    }, {});
  };

  Object.keys(statesMap).forEach(key => {
    statesMap[key].pipe(effect.state.triggerListeners).subscribe();
  });

  return effect;
}

export function isRiewQueueEffect(func) {
  return func && func.__riewEffect === true;
}
