import equal from 'fast-deep-equal';

import { getId } from './utils';

export function State(initialValue, loggable) {
  const s = {};
  let value = initialValue;
  let listeners = [];

  s.loggable = loggable;
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
  };
  s.listeners = () => listeners;
  s.addListener = (effect) => {
    listeners.push(effect);
  };
  s.removeListener = (effect) => {
    listeners = listeners.filter(({ id }) => id !== effect.id);
  };

  return s;
};
