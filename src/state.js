import equal from 'fast-deep-equal';

import { getId } from './utils';
import { createQueueAPI, createQueue } from './queue';
import { EFFECT_START, EFFECT_END, QUEUE_STEP_IN, QUEUE_STEP_OUT } from './constants';

export function isState(state) {
  return state && state.id && state.id.split('_').shift() === 's';
}

export function State(initialValue, emit) {
  const state = {};
  let value = initialValue;
  let listeners = [];
  let queues = [];
  let active = true;

  state.id = getId('s');
  state.queueAPI = createQueueAPI();
  state.triggerListeners = () => (listeners.forEach(l => l()));
  state.get = () => value;
  state.set = (newValue) => {
    if (equal(value, newValue)) return;
    value = newValue;
    state.triggerListeners();
  };
  state.destroy = () => {
    active = false;
    state.cancel();
    listeners = [];
  };
  state.listeners = () => listeners;
  state.addListener = (effect) => listeners.push(effect);
  state.removeListener = (effect) => (listeners = listeners.filter(({ id }) => id !== effect.id));
  state.runQueue = (effect, payload) => {
    if (!active) return value;
    const queue = createQueue(
      state,
      {
        start(q) {
          emit(EFFECT_START, effect, q);
        },
        end(q) {
          queues = queues.filter(({ id }) => id !== q.id);
          emit(EFFECT_END, effect);
        },
        stepIn(q) {
          emit(QUEUE_STEP_IN, effect, q);
        },
        stepOut(q) {
          emit(QUEUE_STEP_OUT, effect, q);
        }
      }
    );

    effect.items.forEach(({ type, func }) => queue.add(type, func));
    queues.push(queue);
    return queue.process(...payload);
  };
  state.cancel = () => {
    queues.forEach(q => q.cancel());
    queues = [];
  };
  state.queues = () => queues;

  return state;
};
