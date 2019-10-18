import equal from 'fast-deep-equal';

import { getId } from './utils';
import { QueueAPI, createQueue } from './queue';
import { STATE_VALUE_CHANGE, CANCEL_EFFECT } from './constants';
import { implementIterableProtocol } from './interfaces';
import { cancel, _fork, grid, destroy } from './index';

export function isEffect(effect) {
  return effect && effect.__riewEffect === true;
}

export function State(initialValue) {
  const state = {};
  let value = initialValue;
  let active = true;

  state.id = getId('s');
  state.get = () => value;
  state.set = (newValue) => {
    if (equal(value, newValue) || active === false) return;
    value = newValue;
    grid.emit(STATE_VALUE_CHANGE).from(state).with(value);
  };
  state.destroy = () => {
    active = false;
    grid.unsubscribe().from(state);
  };
  state.createEffect = (items = []) => {
    let queuesRunning = 0;
    const effect = function (...payload) {
      if (active === false) return value;
      const q = createQueue(state.get(), state.set, () => (queuesRunning -= 1));

      grid.subscribe().to(effect).when(CANCEL_EFFECT, q.cancel);
      effect.items.forEach(({ type, func }) => q.add(type, func));
      queuesRunning += 1;
      return q.process(...payload);
    };

    effect.__riewEffect = true;
    effect.id = getId('e');
    effect.stateId = state.id;
    effect.items = items;

    implementIterableProtocol(effect);

    effect.isMutating = () => {
      return !!effect.items.find(({ type }) => type === 'mutate');
    };
    effect.destroy = () => {
      cancel(effect);
      grid.unsubscribe().from(effect);
    };
    effect.isRunning = () => {
      return queuesRunning > 0;
    };

    Object.keys(QueueAPI).forEach(m => {
      effect[m] = (...methodArgs) => _fork(state, effect, { type: m, func: methodArgs });
    });

    return effect;
  };

  return state;
};
