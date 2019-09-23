function noop() {};
const logger = {
  log: noop,
  reset: noop,
  events: noop,
  report: noop
};

export default logger;
