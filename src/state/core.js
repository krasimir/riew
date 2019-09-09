import equal from 'fast-deep-equal';

import { getId } from '../utils';

export default function createCore(initialValue) {
  const api = {};
  let value = initialValue;
  let listeners = [];

  api.id = getId('s');
  api.triggerListeners = () => {
    listeners.forEach(l => l());
  };

  api.get = () => value;
  api.set = (newValue) => {
    let isEqual = equal(value, newValue);

    value = newValue;
    if (!isEqual) api.triggerListeners();
  };
  api.teardown = () => {
    listeners = [];
  };
  api.listeners = () => listeners;
  api.addListener = (trigger) => {
    listeners.push(trigger);
  };
  api.removeListener = (trigger) => {
    listeners = listeners.filter(({ id }) => id !== trigger.id);
  };

  return api;
};
