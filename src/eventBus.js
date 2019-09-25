/* eslint-disable consistent-return */

export default function createEventBus(events = {}) {
  const emit = (type, ...payload) => {
    if (events[type]) {
      return events[type](...payload);
    }
  };

  return emit;
};
