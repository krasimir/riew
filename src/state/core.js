import equal from 'fast-deep-equal';

import { getId } from '../utils';

export default function createCore(initialValue) {
  const api = {};
  let active = true;
  let value = initialValue;
  let listeners = [];
  let createdQueues = [];

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
    createdQueues.forEach(q => q.teardown());
    createdQueues = [];
    listeners = [];
    active = false;
  };
  api.addQueue = q => {
    createdQueues.push(q);
  };
  api.removeQueue = q => {
    createdQueues = createdQueues.filter(({ id }) => q.id !== id);
  };
  api.isActive = () => active;
  api.createdQueues = () => createdQueues;
  api.listeners = () => listeners;
  api.addListener = (trigger) => {
    listeners.push(trigger);
  };
  api.removeListener = (trigger) => {
    listeners = listeners.filter(({ id }) => id !== trigger.id);
  };

  return api;
};
