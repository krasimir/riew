function noop() {};
const logger = {
  log: noop,
  events: noop,
  grid: noop,
  data: { events: noop, grid: noop },
  reset: noop
};

export default logger;
