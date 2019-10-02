import {
  implementLoggableInterface,
  implementQueueProtocol,
  implementIterableProtocol,
  implementObservableInterface
} from './interfaces';
import { getId } from './utils';
import { EFFECT_EXPORTED, STATE_VALUE_CHANGE } from './constants';

export default function Event(state, items = []) {
  const event = function (...payload) {
    return state.runQueue(event, payload);
  };

  event.id = getId('e');
  event.items = items;
  event.state = state;

  implementLoggableInterface(event, state.loggable);
  implementIterableProtocol(event);
  implementQueueProtocol(event);
  implementObservableInterface(event);

  // event direct methods
  // event.define = (methodName, func) => {
  //   state.queueAPI.define(methodName, func);
  //   events.forEach(implementQueueProtocol);
  //   return event;
  // };
  event.isMutating = () => {
    return !!event.items.find(({ type }) => type === 'mutate');
  };
  event.subscribe = (initialCall = false) => {
    if (event.isMutating()) {
      throw new Error('You should not subscribe an event that mutates the state. This will lead to endless recursion.');
    }
    const newEvent = event.fork();

    if (initialCall) newEvent();
    state.on(STATE_VALUE_CHANGE, () => newEvent());
    return newEvent;
  };
  event.unsubscribe = () => {
    state.removeListener(event);
    return event;
  };
  event.destroy = () => {
    state.destroy();
    return event;
  };
  event.export = name => {
    event.emit(EFFECT_EXPORTED, name);
    return event;
  };
  event.fork = (newItem) => {
    const newItems = [ ...event.items ];

    if (newItem) {
      newItems.push(newItem);
    }

    const newEvent = Event(state, newItems);

    newEvent.loggability(event.loggable);
    newEvent.setParent(event.id);
    return newEvent;
  };
  event.test = function (callback) {
    const test = event.fork();
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
  event.setParent = id => (event.parent = id);

  return event;
};
