import equal from 'fast-deep-equal';

import { getId } from './utils';
import { createQueueAPI, createQueue } from './queue';
import { QUEUE_END, QUEUE_STEP_IN, QUEUE_STEP_OUT, EFFECT_EXPORTED, STATE_DESTROY } from './constants';
import { implementLoggableInterface } from './interfaces';

export function isEffect(effect) {
  return effect && effect.id && effect.id.split('_').shift() === 'e';
}

export function State(initialValue, emit, loggable, name) {
  const state = {};
  let value = initialValue;
  let listeners = [];
  let queues = [];
  let effects = [];
  let active = true;

  implementLoggableInterface(state, loggable);

  state.id = getId('s');
  state.name = name;
  state.queues = () => queues;
  state.effects = () => effects;
  state.queueAPI = createQueueAPI();
  state.triggerListeners = () => (listeners.forEach(l => l()));
  state.get = () => value;
  state.set = (newValue) => {
    if (equal(value, newValue)) return;
    value = newValue;
    state.triggerListeners();
  };
  state.cancel = () => {
    queues.forEach(q => q.cancel());
    queues = [];
  };
  state.destroy = () => {
    active = false;
    state.cancel();
    listeners = [];
    emit(STATE_DESTROY, state);
    effects = [];
  };
  state.listeners = () => listeners;
  state.addListener = (effect) => listeners.push(effect);
  state.removeListener = (effect) => (listeners = listeners.filter(({ id }) => id !== effect.id));
  state.runQueue = (effect, payload) => {
    if (!active) return value;
    const queue = createQueue(
      state,
      effect,
      {
        start(q) {},
        stepIn(q) {
          emit(QUEUE_STEP_IN, effect);
        },
        stepOut(q) {
          emit(QUEUE_STEP_OUT, effect);
        },
        end(q) {
          queues = queues.filter(({ id }) => id !== q.id);
          emit(QUEUE_END, effect);
        }
      }
    );

    queues.push(queue);
    return queue.process(...payload);
  };
  state.createEffect = (items = []) => {
    const effect = function (...payload) {
      return state.runQueue(effect, payload);
    };

    effect.id = getId('e');
    effect.items = items;
    effect.parent = state.id;
    effects.push(effect);

    implementLoggableInterface(effect, state.loggable);
    implementIterableProtocol(effect);
    implementQueueProtocol(effect);

    // effect direct methods
    effect.define = (methodName, func) => {
      state.queueAPI.define(methodName, func);
      effects.forEach(implementQueueProtocol);
      return effect;
    };
    effect.isMutating = () => {
      return !!effect.items.find(({ type }) => type === 'mutate');
    };
    effect.subscribe = (initialCall = false) => {
      if (effect.isMutating()) {
        throw new Error('You should not subscribe a effect that mutates the state. This will lead to endless recursion.');
      }
      if (initialCall) effect();
      state.addListener(effect);
      return effect;
    };
    effect.unsubscribe = () => {
      state.removeListener(effect);
      return effect;
    };
    effect.destroy = () => {
      state.destroy();
      return effect;
    };
    effect.cancel = () => {
      queues = queues.filter(q => {
        if (q.causedBy === effect.id) {
          q.cancel();
          return false;
        }
        return true;
      });
    };
    effect.export = name => {
      emit(EFFECT_EXPORTED, effect, name);
      return effect;
    };
    effect.test = function (callback) {
      const test = forkEffect(effect);
      const tools = {
        setValue(newValue) {
          test.items = [
            { type: 'map', func: [ () => newValue ] },
            ...test.items
          ];
        },
        swap(index, funcs, type) {
          if (!Array.isArray(funcs)) funcs = [funcs];
          test.items[index].func = funcs;
          if (type) {
            test.items[index].type = type;
          }
        },
        swapFirst(funcs, type) {
          tools.swap(0, funcs, type);
        },
        swapLast(funcs, type) {
          tools.swap(test.items.length - 1, funcs, type);
        }
      };

      callback(tools);
      return test;
    };
    effect.setParent = id => (effect.parent = id);

    return effect;
  };

  function forkEffect(effect, newItem) {
    const newItems = [ ...effect.items ];

    if (newItem) {
      newItems.push(newItem);
    }

    const newEffect = state.createEffect(newItems);

    newEffect.loggability(effect.loggable);
    newEffect.setParent(effect.id);
    return newEffect;
  };
  function implementIterableProtocol(effect) {
    if (typeof Symbol !== 'undefined' && typeof Symbol.iterator !== 'undefined') {
      effect[Symbol.iterator] = function () {
        const values = [ effect.map(), effect.mutate(), state ];
        let i = 0;

        return {
          next: () => ({
            value: values[ i++ ],
            done: i > values.length
          })
        };
      };
    }
  };
  function implementQueueProtocol(effect) {
    Object.keys(state.queueAPI).forEach(m => {
      effect[m] = (...methodArgs) => forkEffect(effect, { type: m, func: methodArgs });
    });
  }

  return state;
};
