function noop() {};
const logger = {
  log: noop,
  events: noop,
  data: { events: noop }
};

export default logger;
