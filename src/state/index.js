import equal from 'fast-deep-equal';

import { implementIterable } from '../utils';
import createCore from './core';
import createTrigger from './trigger';

export function createState(initialValue) {
  return createTrigger(createCore(initialValue))();
};

export function mergeStates(statesMap) {
  const fetchSourceValues = () => Object.keys(statesMap).reduce((result, key) => {
    const [ s ] = statesMap[key];

    result[key] = s();
    return result;
  }, {});
  const s = createState(fetchSourceValues());

  implementIterable(
    s,
    s.map(fetchSourceValues),
    s.mutate((current, newValue) => {
      if (typeof newValue !== 'object') {
        throw new Error('Wrong merged state value. Must be key-value pairs.');
      }
      return Object.keys(statesMap).reduce((result, key) => {
        const [ getChildState, setChildState ] = statesMap[key];

        if (key in newValue && !equal(newValue[key], getChildState())) {
          setChildState(newValue[key]);
          result[key] = newValue[key];
        } else {
          result[key] = getChildState();
        }
        return result;
      }, {});
    })
  );

  Object.keys(statesMap).forEach(key => {
    statesMap[key].pipe((value) => {
      const [ , setMergedState ] = s;

      setMergedState({ [key]: value });
    }).subscribe();
  });

  return s;
}

export function isRiewQueueTrigger(func) {
  return func && func.__riewTrigger === true;
}
