import equal from 'fast-deep-equal';

import { getId } from './utils';
import { createQueue, QueueAPI } from './queue';
import { QUEUE_SET_STATE_VALUE, STATE_VALUE_CHANGE } from './constants';
import { implementObservableInterface, implementIterableProtocol } from './interfaces';
import { cancel, _fork } from './index';

export function isEffect(effect) {
  return effect && effect.id && effect.id.substr(0, 1) === 'e';
}

export function State(initialValue, loggable) {
  const state = {};
  let value = initialValue;
  let active = true;

  implementObservableInterface(state);

  state.id = getId('s');
  state.get = () => value;
  state.set = (newValue) => {
    if (equal(value, newValue) || active === false) return;
    value = newValue;
    state.emit(STATE_VALUE_CHANGE, value);
  };
  state.destroy = () => {
    active = false;
    state.off();
  };
  state.createEffect = (items = []) => {
    const effect = function (...payload) {
      if (active === false) return value;
      const q = createQueue(state.get(), effect);

      q.on(QUEUE_SET_STATE_VALUE, state.set);
      return q.process(...payload);
    };

    effect.id = getId('e');
    effect.stateId = state.id;
    effect.items = items;

    implementIterableProtocol(effect);
    implementObservableInterface(effect);

    effect.isMutating = () => {
      return !!effect.items.find(({ type }) => type === 'mutate');
    };
    effect.destroy = () => {
      cancel(effect);
      effect.off();
    };

    Object.keys(QueueAPI).forEach(m => {
      effect[m] = (...methodArgs) => _fork(state, effect, { type: m, func: methodArgs });
    });

    return effect;
  };

  return state;
};
