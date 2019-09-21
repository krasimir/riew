import sanitize from './sanitize';
import { getFuncName } from './utils';
import {
  STATE_CREATED,
  STATE_TEARDOWN,
  EFFECT_ADDED,
  EFFECT_REMOVED,
  EFFECT_TEARDOWN,
  EFFECT_STEP,
  EFFECT_EXPORTED,
  RIEW_CREATED,
  RIEW_RENDER,
  RIEW_UNMOUNT
} from './constants';

const MAX_NUM_OF_EVENTS = 850;
const INDENT = 12;

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

function getSpaces(n) {
  let str = '';

  for (let i = 0; i < n; i++) str += ' ';
  return str;
};
function formatQueueItem({ type, name }) {
  return `${ type }${ name !== 'unknown' ? `(${ name })` : ''}`;
}
function formatId(obj) {
  if (!obj.id) return getSpaces(INDENT);
  const [ type, n ] = obj.id.split('_');
  const what = (function () {
    if (type === 's') return 'state';
    if (type === 'r') return 'riew';
    if (type === 'e') return 'effect';
    return type;
  })();
  const text = `${ what }#${ n }`;

  if (text.length < INDENT) {
    return getSpaces(INDENT - text.length) + text + ' ';
  }
  return text + ' ';
}

const normalizers = {
  [ STATE_CREATED ]: normalizeState,
  [ STATE_TEARDOWN ]: normalizeState,
  [ EFFECT_ADDED ]: normalizeEffect,
  [ EFFECT_REMOVED ]: normalizeEffect,
  [ EFFECT_TEARDOWN ]: normalizeEffect,
  [ EFFECT_STEP ]: (effect, q, phase) => {
    return {
      ...normalizeEffect(effect),
      queue: normalizeQueue(q),
      phase
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
  },
  [ RIEW_RENDER ]: (r, props) => {
    return {
      id: r.id,
      name: r.name,
      props: sanitize(props)
    };
  },
  [ RIEW_UNMOUNT ]: (r) => {
    return {
      id: r.id,
      name: r.name
    };
  }
};

function createSimpleStorage() {
  const api = {};
  let items = [];

  api.add = item => items.push(item);
  api.get = () => items;
  api.remove = item => (items = items.filter(({ id }) => item !== id));
  api.clear = () => (items = []);

  return api;
}

function createLogger() {
  const api = {};
  let events = [];
  let states = createSimpleStorage();
  let effects = createSimpleStorage();
  let riews = createSimpleStorage();

  api.log = (type, ...payload) => {
    if ('loggable' in payload[0] && payload[0].loggable === false) {
      return;
    }
    if (events.length > MAX_NUM_OF_EVENTS) {
      events.shift();
    }
    switch (type) {
      case STATE_CREATED: states.add(payload[0]); break;
      case STATE_TEARDOWN: states.remove(payload[0]); break;
      case EFFECT_ADDED: effects.add(payload[0]); break;
      case EFFECT_REMOVED: effects.remove(payload[0]); break;
      case EFFECT_TEARDOWN: effects.remove(payload[0]); break;
      case RIEW_CREATED: riews.add(payload[0]); break;
      case RIEW_UNMOUNT: riews.remove(payload[0]); break;
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
          console.log(`${ formatId(event) } +`, event.value);
          break;
        case STATE_TEARDOWN:
          console.log(`${ formatId(event) } ✖`, event.value);
          break;
        case RIEW_CREATED:
          // console.log(`${ formatId(event) } + ${ event.view } | ${ event.controllers.join(', ')}`);
          break;
        case RIEW_UNMOUNT:
          console.log(`${ formatId(event) } ✖ ${ event.name }`);
          break;
        case RIEW_RENDER:
          console.log(`${ formatId(event) } ✔ ${ event.name }`, event.props);
          break;
        case EFFECT_ADDED:
          console.log(`${ formatId(event) } + [${ event.queueItems.map(formatQueueItem).join(', ') }]`);
          break;
        case EFFECT_STEP:
          const queue = event.queue;
          const text = formatQueueItem(queue.items[queue.index]);

          if (event.phase === 'in') {
            console.log(`${ formatId(event) } > ${ text }`, queue.result);
          } else {
            console.log(`${ formatId(event) } < ${ text }`, queue.result);
          }
          break;
        case EFFECT_REMOVED:
          console.log(`${ formatId(event) } ✖`);
          break;
        case EFFECT_TEARDOWN:
          // console.log(`${ formatId(event) } ✖`);
          break;
        default:
          console.log(getSpaces(INDENT) + '  ' + event.type);
      }
    });
  };
  api.grid = () => {
    const grid = api.data.grid();

    console.log(grid);
  };
  api.clear = () => {
    events = [];
    states.clear();
    effects.clear();
    riews.clear();
  };
  api.data = {
    events() { return events; },
    grid() {

    }
  };

  return api;
};

const logger = createLogger();

export default logger;
