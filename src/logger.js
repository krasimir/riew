import sanitize from './sanitize';
import { getFuncName } from './utils';
import {
  STATE_CREATED,
  EFFECT_ADDED,
  EFFECT_REMOVED,
  EFFECT_TEARDOWN,
  EFFECT_STEP,
  EFFECT_EXPORTED,
  RIEW_CREATED
} from './constants';

const MAX_NUM_OF_EVENTS = 850;

// normalizers

function normalizeState(state) {
  return {
    id: state.id,
    value: sanitize(state.get())
  };
}
function normalizeEffect(effect) {
  return {
    id: effect.id,
    state: normalizeState(effect.state),
    queueItems: effect.__itemsToCreate.map(({ type, func }) => ({
      type,
      name: getFuncName(func)
    }))
  };
}
function normalizeQueue(q) {
  return {
    index: q.index,
    result: sanitize(q.result),
    items: q.items.map(({ type, func }) => ({ type, name: getFuncName(func) }))
  };
}

function formatQueueItem({ type, name }) {
  return `${ type }${ name !== 'unknown' ? `(${ name })` : ''}`;
}

const normalizers = {
  [ STATE_CREATED ]: normalizeState,
  [ EFFECT_ADDED ]: normalizeEffect,
  [ EFFECT_REMOVED ]: normalizeEffect,
  [ EFFECT_TEARDOWN ]: normalizeEffect,
  [ EFFECT_STEP ]: (effect, q) => {
    return {
      ...normalizeEffect(effect),
      queue: normalizeQueue(q)
    };
  },
  [ EFFECT_EXPORTED ]: normalizeEffect,
  [ RIEW_CREATED ]: (r, view, controllers) => {
    return {
      id: r.id,
      name: r.name,
      view: getFuncName(view),
      controllers: controllers.map(getFuncName)
    };
  }
};

function createLogger() {
  const api = {};
  const events = [];

  api.log = (type, ...payload) => {
    if (events.length > MAX_NUM_OF_EVENTS) {
      events.shift();
    }
    if (normalizers[type]) {
      events.push({ type, ...normalizers[type](...payload) });
    } else {
      events.push({ type });
    }
  };
  api.events = () => {
    events.forEach(event => {
      switch (event.type) {
        case STATE_CREATED:
          console.log(`${ event.id }:${ event.type }`, event.value);
          break;
        case RIEW_CREATED:
          console.log(`${ event.id }:${ event.type }(${ event.name })`);
          console.log(` ↳ view: ${ event.view }, controllers: ${ event.controllers.join(', ')}`);
          break;
        case EFFECT_ADDED:
          console.log(`${ event.id }:${ event.type } [${ event.queueItems.map(formatQueueItem) }]`);
          break;
        case EFFECT_STEP:
          const queue = event.queue;

          console.log(`${ event.id }:${ event.type }[${ queue.index }]->${ formatQueueItem(queue.items[queue.index]) }`, queue.result);
          break;
        case EFFECT_REMOVED:
          console.log(`${ event.id }:${ event.type }`);
          break;
        default:
          console.log(event.type);
      }
    });
  };
  api.data = {
    events() { return events; }
  };

  return api;
};

const logger = createLogger();

export default logger;
