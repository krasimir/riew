function noop() {};
const logger = {
  log: noop,
  events: noop,
  grid: noop,
  data: { events: noop, grid: noop },
  clear: noop
};

export default logger;
