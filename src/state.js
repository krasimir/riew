import equal from 'fast-deep-equal';

import { getId } from './utils';
import { createQueue, QueueAPI } from './queue';
import { STATE_VALUE_CHANGE, CANCEL_EFFECT } from './constants';
import { implementIterableProtocol } from './interfaces';
import { cancel, _fork, grid } from './index';

export function isEffect(effect) {
  return effect && effect.id && effect.id.substr(0, 1) === 'e';
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
    const effect = function (...payload) {
      if (active === false) return value;
      const q = createQueue(state.get(), state.set);

      grid.subscribe().to(effect).when(CANCEL_EFFECT, q.cancel);
      effect.items.forEach(({ type, func }) => q.add(type, func));
      return q.process(...payload);
    };

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

    Object.keys(QueueAPI).forEach(m => {
      effect[m] = (...methodArgs) => _fork(state, effect, { type: m, func: methodArgs });
    });

    return effect;
  };

  return state;
};
