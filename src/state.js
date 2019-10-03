import equal from 'fast-deep-equal';

import { getId } from './utils';
import { createQueue } from './queue';
import { STATE_DESTROY, QUEUE_SET_STATE_VALUE, STATE_VALUE_CHANGE } from './constants';
import { implementLoggableInterface, implementObservableInterface } from './interfaces';

export function State(initialValue, loggable) {
  const state = {};
  let value = initialValue;
  let active = true;

  implementLoggableInterface(state, loggable);
  implementObservableInterface(state);

  state.id = getId('s');
  state.get = () => value;
  state.set = (newValue) => {
    if (equal(value, newValue)) return;
    value = newValue;
    state.emit(STATE_VALUE_CHANGE, value);
  };
  state.destroy = () => {
    active = false;
    state.emit(STATE_DESTROY);
    state.off();
  };
  state.runQueue = (effect, payload) => {
    if (!active) return value;
    const q = createQueue(state.get(), effect);

    q.on(QUEUE_SET_STATE_VALUE, state.set);
    return q.process(...payload);
  };

  return state;
};
