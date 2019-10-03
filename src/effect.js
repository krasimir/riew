import {
  implementLoggableInterface,
  implementQueueProtocol,
  implementIterableProtocol,
  implementObservableInterface
} from './interfaces';
import { getId } from './utils';
import { EFFECT_EXPORTED } from './constants';

export function isEffect(e) {
  return e && e.id && e.id.split('_').shift() === 'e';
}

export default function Event(state, items = []) {
  const effect = function (...payload) {
    return state.runQueue(effect, payload);
  };

  effect.id = getId('e');
  effect.items = items;
  effect.state = state;

  implementLoggableInterface(effect, state.loggable);
  implementIterableProtocol(effect);
  implementQueueProtocol(effect);
  implementObservableInterface(effect);

  // effect direct methods
  // effect.define = (methodName, func) => {
  //   state.queueAPI.define(methodName, func);
  //   effects.forEach(implementQueueProtocol);
  //   return effect;
  // };
  effect.isMutating = () => {
    return !!effect.items.find(({ type }) => type === 'mutate');
  };
  effect.export = name => {
    effect.emit(EFFECT_EXPORTED, name);
    return effect;
  };
  effect.fork = (newItem) => {
    const newItems = [ ...effect.items ];

    if (newItem) {
      newItems.push(newItem);
    }

    const newEvent = Event(state, newItems);

    newEvent.loggability(effect.loggable);
    newEvent.setParent(effect.id);
    return newEvent;
  };
  effect.test = function (callback) {
    const test = effect.fork();
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
