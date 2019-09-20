function noop() {};
const logger = {
  log: noop,
  events: { get: noop, log: noop }
};

export default logger;
