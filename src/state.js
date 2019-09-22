import equal from 'fast-deep-equal';

import { getId } from './utils';
import { createQueueAPI, createQueue } from './queue';
import { EFFECT_START, EFFECT_END, QUEUE_STEP_IN, QUEUE_STEP_OUT } from './constants';

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
  s.runQueue = (effect, payload) => {
    if (!active) return value;
    emit(EFFECT_START, effect);
    const queue = createQueue(
      s,
      {
        start() {
          emit(EFFECT_START, effect);
        },
        end() {
          queues = queues.filter(({ id }) => id !== queue.id);
          emit(EFFECT_END, effect);
        },
        stepIn() {
          emit(QUEUE_STEP_IN, effect, queue);
        },
        stepOut() {
          emit(QUEUE_STEP_OUT, effect, queue);
        }
      }
    );

    effect.items.forEach(({ type, func }) => queue.add(type, func));
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
