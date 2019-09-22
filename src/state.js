import equal from 'fast-deep-equal';

import { getId } from './utils';
import { createQueueAPI, createQueue } from './queue';
import { QUEUE_END } from './constants';

export function isState(state) {
  return state && state.id && state.id.split('_').shift() === 's';
}

export function State(initialValue, emit) {
  const s = {};
  let value = initialValue;
  let listeners = [];
  let queues = [];
  let active = true;

  s.id = getId('s');
  s.queueAPI = createQueueAPI();
  s.triggerListeners = () => (listeners.forEach(l => l()));
  s.get = () => value;
  s.set = (newValue) => {
    if (equal(value, newValue)) return;
    value = newValue;
    s.triggerListeners();
  };
  s.destroy = () => {
    active = false;
    s.cancel();
    listeners = [];
  };
  s.listeners = () => listeners;
  s.addListener = (effect) => listeners.push(effect);
  s.removeListener = (effect) => (listeners = listeners.filter(({ id }) => id !== effect.id));
  s.runQueue = (items, payload) => {
    if (!active) return value;
    const queue = createQueue(
      s,
      emit.extend({
        [ QUEUE_END ]: () => {
          queues = queues.filter(q => q.id !== queue.id);
        }
      })
    );

    items.forEach(({ type, func }) => queue.add(type, func));
    queues.push(queue);
    return queue.process(...payload);
  };
  s.cancel = () => {
    queues.forEach(q => q.cancel());
    queues = [];
  };
  s.queues = () => queues;

  return s;
};
