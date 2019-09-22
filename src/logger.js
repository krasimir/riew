/* eslint-disable consistent-return */

import sanitize from './sanitize';
import { getFuncName } from './utils';
import { isState } from './state';
import { isEffect } from './effect';
import { isQueue } from './queue';
import { isGridNode } from './grid';
import { isRiew } from './riew';

const MAX_NUM_OF_EVENTS = 850;
const INDENT = 12;

function formatQueueItem({ type, func }) {
  const name = getFuncName(func);

  return `${ type }${ name !== 'unknown' ? `:${ name }` : ''}`;
}

function normalizeState(state) {
  return {
    id: state.id,
    value: sanitize(state.get()),
    queues: state.queues().map(normalizeQueue)
  };
}
function normalizeEffect(effect) {
  return {
    id: effect.id,
    state: normalizeState(effect.state),
    items: effect.items.map(({ type }) => type)
  };
}
function normalizeQueue(q) {
  const items = q.items.map(formatQueueItem);

  return {
    id: q.id,
    result: sanitize(q.result),
    items: items,
    index: q.index,
    currentItem: items[q.index]
  };
}
function normalizeGridNode(node) {
  // console.log(node.product);
  return {
    id: node.id,
    parent: node.parentId,
    product: normalize([ node.product ])
  };
}
function normalizeRiew(riew, props) {
  return {
    id: riew.id,
    name: riew.name,
    active: riew.isActive(),
    props: sanitize(props)
  };
}

function normalize(payload) {
  let state, effect, queue, gridNode, riew;
  let product = payload[0];

  if (product && product.loggable === false) return;

  if (isState(product)) {
    state = normalizeState(product);
  } else if (isEffect(product)) {
    effect = normalizeEffect(product);
  } else if (isQueue(product)) {
    queue = normalizeQueue(product);
  } else if (isGridNode(product)) {
    gridNode = normalizeGridNode(product);
  } else if (isRiew(product)) {
    riew = normalizeRiew(product, payload[1]);
  }

  return Object.assign(
    {},
    state,
    effect,
    queue,
    gridNode,
    riew
  );
}

function Logger() {
  const api = {};
  let events = [];

  api.log = (type, payload) => {
    if (Array.isArray(payload[0])) {
      payload[0].forEach(p => api.log(type, p));
      return;
    };
    const normalizedPayload = normalize(payload);

    if (normalizedPayload) {
      events.push({ type, ...normalizedPayload });
    }
  };
  api.reset = () => {
    events = [];
  };
  api.events = () => events;

  return api;
}

const logger = Logger();

export default logger;

/*

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
    queueItems: effect.__items.map(({ type, func }) => ({
      type,
      name: getFuncName(func)
    })),
    queues: effect.__queues.map(normalizeQueue)
  };
}
function normalizeRiew(r, props, view, controllers) {
  return {
    id: r.id,
    props: sanitize(props),
    view: getFuncName(view),
    controllers: controllers.map(getFuncName)
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
function formatId(obj, noSpaces = false) {
  if (!obj.id) return getSpaces(INDENT);
  const [ type, n ] = obj.id.split('_');
  const what = (function () {
    if (type === 's') return `$${ n }`;
    if (type === 'r') return `<${ n }>`;
    if (type === 'e') return `effect#${ n }`;
    return type;
  })();
  const text = `${ what }`;

  if (noSpaces) {
    return text;
  }

  if (text.length < INDENT) {
    return getSpaces(INDENT - text.length) + text + ' ';
  }
  return text + ' ';
}
function formatQueueItems(effect) {
  return effect.queueItems.map(formatQueueItem).join(', ');
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
  [ RIEW_CREATED ]: normalizeRiew,
  [ RIEW_RENDER ]: normalizeRiew,
  [ RIEW_UNMOUNT ]: normalizeRiew
};

function createSimpleStorage() {
  const api = {};
  let items = [];

  api.add = item => {
    const found = items.findIndex(({ id }) => item.id === id);

    if (found >= 0) {
      items[found] = item;
    } else {
      items.push(item);
    }
  };
  api.get = () => items;
  api.remove = item => (items = items.filter(({ id }) => item.id !== id));
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

    let item = {};

    if (normalizers[type]) {
      item = normalizers[type](...payload);
      events.push({ type, ...item });
    } else {
      events.push({ type });
    }

    switch (type) {
      case STATE_CREATED: states.add(item); break;
      case STATE_TEARDOWN: states.remove(item); break;
      case EFFECT_ADDED:
      case EFFECT_STEP:
        effects.add(item);
        break;
      case EFFECT_REMOVED:
      case EFFECT_TEARDOWN:
        // effects.remove(item);
        break;
      case RIEW_CREATED:
      case RIEW_RENDER:
        riews.add(item);
        break;
      case RIEW_UNMOUNT: riews.remove(item); break;
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
          console.log(`${ formatId(event) } + [${ formatQueueItems(event) }]`);
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

    riews.get().forEach(riew => {
      console.log(`${ formatId(riew) } ${ riew.view }`, riew.props);
    });
    console.log(getSpaces(INDENT) + '  ~~~');
    grid.states.forEach(state => {
      console.log(formatId(state), state.value);
      state.effects.forEach(effect => {
        console.log(`${ getSpaces(INDENT) }  ↳ ${ formatId(effect, true) }`);
        console.log(effect);
      });
    });

    // console.log(JSON.stringify(grid, null, 2));
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
      const ss = states.get().map((state) => ({ ...state, effects: [] }));

      effects.get().forEach(effect => {
        const state = ss.find(({ id }) => effect.state.id);

        if (state) {
          state.effects.push(effect);
        } else {
          ss.push({ ...effect.state, effects: [ effect ]});
        }
      });
      // console.log(JSON.stringify(states.get(), null, 2));
      // return {
      //   states: states.get().
      // }
      // console.log(JSON.stringify(effects.get(), null, 2));

      return {
        states: ss
      };
    }
  };

  return api;
};

const logger = createLogger();

export default logger;
*/
