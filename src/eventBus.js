/* eslint-disable consistent-return */
import logger from './logger';

export default function createEventBus(events = {}) {
  const listeners = [ events ];
  const emit = (type, ...payload) => {
    if (__DEV__) logger.log(type, payload);
    listeners.forEach(es => {
      if (es[type]) {
        return es[type](...payload);
      }
    });
  };

  emit.extend = (newEvents) => {
    listeners.push(newEvents);
    return emit;
  };

  return emit;
};
