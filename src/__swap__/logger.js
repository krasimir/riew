function noop() {};
const logger = {
  log: noop,
  reset: noop,
  events: noop
};

export default logger;
