/* eslint-disable consistent-return */
import grid from './grid';

export default function createEventBus(events = {}) {
  const emit = (type, ...payload) => {
    if (__DEV__) grid.dispatch(type, ...payload);
    if (events[type]) {
      return events[type](...payload);
    }
  };

  return emit;
};
