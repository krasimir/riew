import equal from 'fast-deep-equal';

import createTrigger from './trigger';

export function createState(initialValue) {
  return createTrigger(initialValue)();
};

export function mergeStates(statesMap) {
  const fetchSourceValues = () => Object.keys(statesMap).reduce((result, key) => {
    const [ s ] = statesMap[key];

    result[key] = s();
    return result;
  }, {});
  const trigger = createState();

  trigger.state.get = fetchSourceValues;
  trigger.state.set = newValue => {
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
    statesMap[key].pipe(trigger.state.triggerListeners).subscribe();
  });

  return trigger;
}

export function isRiewQueueTrigger(func) {
  return func && func.__riewTrigger === true;
}
