import sanitize from './sanitize';
import { getFuncName } from './utils';

const MAX_NUM_OF_EVENTS = 850;

export const STATE_CREATED = 'STATE_CREATED';
export const EFFECT_ADDED = 'EFFECT_ADDED';
export const EFFECT_REMOVED = 'EFFECT_REMOVED';
export const EFFECT_TEARDOWN = 'EFFECT_TEARDOWN';
export const EFFECT_STEP = 'EFFECT_STEP';
export const EFFECT_EXPORTED = 'EFFECT_EXPORTED';
export const RIEW_CREATED = 'RIEW_CREATED';

function formatState(state) {
  return {
    id: state.id,
    value: sanitize(state.get())
  };
}
function formatEffect(effect) {
  return {
    id: effect.id,
    state: formatState(effect.state),
    queueItems: effect.__itemsToCreate.map(({ type, func }) => ({
      type,
      func: getFuncName(func)
    })),
    queues: effect.__queues.map(formatQueue)
  };
}
function formatQueue(q) {
  return {
    index: q.index,
    result: sanitize(q.result),
    items: q.items.map(({ type, func }) => ({ type, name: getFuncName(func) }))
  };
}

function formatEvent(type, payload) {
  switch (type) {
    case STATE_CREATED:
      return {
        type,
        state: formatState(payload[0])
      };
    case RIEW_CREATED:
      const view = payload[0];
      const controllers = payload[1];

      return {
        type,
        view: getFuncName(view),
        controllers: controllers.map(getFuncName)
      };
    case EFFECT_ADDED:
    case EFFECT_STEP:
      return {
        type,
        effect: formatEffect(payload[0])
      };
  }
  return { type };
}

export function createLogger() {
  const api = {};
  const events = [];

  api.log = (type, ...payload) => {
    if (events.length > MAX_NUM_OF_EVENTS) {
      events.shift();
    }
    events.push(formatEvent(type, payload));
  };
  api.events = () => events;

  return api;
};
