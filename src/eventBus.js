/* eslint-disable consistent-return */
import logger from './logger';

export default function createEventBus(events = {}) {
  const emit = (type, ...payload) => {
    if (__DEV__) logger.log(type, ...payload);
    if (events[type]) {
      return events[type](...payload);
    }
  };

  return emit;
};
