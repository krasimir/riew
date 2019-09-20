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
      func: getFuncName(func)
    })),
    queues: effect.__queues.map(normalizeQueue)
  };
}
function normalizeQueue(q) {
  return {
    index: q.index,
    result: sanitize(q.result),
    items: q.items.map(({ type, func }) => ({ type, name: getFuncName(func) }))
  };
}

// types

const state = {
  normalize(payload) {
    return {
      state: normalizeState(payload[0])
    };
  },
  oneliner(event) {
    return `${ event.type } (${ event.state.id })
  ↳ ${ JSON.stringify(event.state.value) }`;
  }
};
const effect = {
  normalize(payload) {
    return {
      effect: normalizeEffect(payload[0])
    };
  },
  oneliner(event) {
    console.log(JSON.stringify(event, null, 2));
    return `${ event.type } (${ event.effect.id })
  ↳ ${ event.effect.queueItems.map(({ type, func }) => `${ type }${ func !== 'unknown' ? `(${ func })` : '' }`) }
  ↳ ${ JSON.stringify(event.effect.state.value) }`;
  }
};
const riew = {
  normalize(payload) {
    const view = payload[0];
    const controllers = payload[1];

    return {
      view: getFuncName(view),
      controllers: controllers.map(getFuncName)
    };
  },
  oneliner(event) {
    return `${ event.type }
  ↳ view: ${ event.view }
  ↳ controllers: ${ event.controllers.join(', ') }`;
  }
};

const TYPES = {
  [ STATE_CREATED ]: state,
  [ EFFECT_ADDED ]: effect,
  [ EFFECT_REMOVED ]: effect,
  [ EFFECT_TEARDOWN ]: effect,
  [ EFFECT_STEP ]: effect,
  [ EFFECT_EXPORTED ]: effect,
  [ RIEW_CREATED ]: riew
};

function createLogger() {
  const api = {};
  const events = [];

  api.log = (type, ...payload) => {
    if (events.length > MAX_NUM_OF_EVENTS) {
      events.shift();
    }
    if (TYPES[type]) {
      events.push({ type, ...TYPES[type].normalize(payload) });
    } else {
      events.push({ type });
    }
  };
  api.events = {
    get() {
      return events;
    },
    log() {
      let str = events.map(event => TYPES[event.type] ? TYPES[event.type].oneliner(event) : event.type).join('\n');

      console.log(str);
    }
  };

  return api;
};

const logger = createLogger();

export default logger;
