import equal from 'fast-deep-equal';

import { getId } from './utils';
import { createQueue } from './queue';
import { QUEUE_END, QUEUE_STEP_IN, QUEUE_STEP_OUT, EFFECT_EXPORTED, STATE_DESTROY } from './constants';
import { implementLoggableInterface, implementQueueProtocol, implementIterableProtocol, implementEventBusInterface } from './interfaces';

export function isEffect(event) {
  return event && event.id && event.id.split('_').shift() === 'e';
}

export function State(initialValue, loggable) {
  const state = {};
  let value = initialValue;
  let listeners = [];
  let queues = [];
  let events = [];
  let active = true;

  implementLoggableInterface(state, loggable);
  implementEventBusInterface(state);

  state.id = getId('s');
  state.queues = () => queues;
  state.events = () => events;
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
    state.emit(STATE_DESTROY);
    events = [];
  };
  state.listeners = () => listeners;
  state.addListener = (event) => listeners.push(event);
  state.removeListener = (event) => (listeners = listeners.filter(({ id }) => id !== event.id));
  state.runQueue = (event, payload) => {
    if (!active) return value;
    const queue = createQueue(
      state,
      event,
      {
        start(q) {},
        stepIn(q) {
          emit(QUEUE_STEP_IN, event);
        },
        stepOut(q) {
          emit(QUEUE_STEP_OUT, event);
        },
        end(q) {
          emit(QUEUE_END, event);
          queues = queues.filter(({ id }) => id !== q.id);
        }
      }
    );

    queues.push(queue);
    return queue.process(...payload);
  };
  state.createEvent = (items = []) => {
    const event = function (...payload) {
      return state.runQueue(event, payload);
    };

    event.id = getId('e');
    event.items = items;
    event.parent = state.id;
    events.push(event);

    implementLoggableInterface(event, state.loggable);
    implementIterableProtocol(event);
    implementQueueProtocol(event);

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
      if (initialCall) event();
      state.addListener(event);
      return event;
    };
    event.unsubscribe = () => {
      state.removeListener(event);
      return event;
    };
    event.destroy = () => {
      state.destroy();
      return event;
    };
    event.cancel = () => {
      queues = queues.filter(q => {
        if (q.causedBy === event.id) {
          q.cancel();
          return false;
        }
        return true;
      });
    };
    event.export = name => {
      event.emit(EFFECT_EXPORTED, name);
      return event;
    };
    event.fork = (event, newItem) => {
      const newItems = [ ...event.items ];

      if (newItem) {
        newItems.push(newItem);
      }

      const newEvent = state.createEvent(newItems);

      newEvent.loggability(event.loggable);
      newEvent.setParent(event.id);
      return newEvent;
    };
    event.test = function (callback) {
      const test = event.fork(event);
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

  return state;
};
