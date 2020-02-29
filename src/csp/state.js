import { go, sput, sclose, grid, logger, sliding } from '../index';
import { getId, isGeneratorFunction, setProp } from '../utils';

const DEFAULT_SELECTOR = v => v;
const DEFAULT_REDUCER = (_, v) => v;
const DEFAULT_ERROR = e => {
  throw e;
};

export default function state(initialValue, parent = null) {
  let value = initialValue;
  const id = getId('state');
  const children = [];

  function syncChildren(initiator) {
    children.forEach(c => {
      if (c.id !== initiator.id) {
        sput(c, { value, syncing: true });
      }
    });
  }

  const api = function(str, name) {
    if (str.length > 1) {
      setProp(api, 'name', str[0] + name + str[1]);
    } else {
      setProp(api, 'name', str[0]);
    }
    return api;
  };

  setProp(api, 'name', 'state');

  api.id = id;
  api['@state'] = true;
  api.parent = parent;
  api.children = () => children;
  api.chan = (
    selector = DEFAULT_SELECTOR,
    reducer = DEFAULT_REDUCER,
    onError = DEFAULT_ERROR
  ) => {
    const ch = sliding(1, 'sliding', id);
    sput(ch, value);
    ch.afterTake((item, cb) => {
      try {
        if (isGeneratorFunction(selector)) {
          go(selector, routineRes => cb(routineRes), [item], id);
          return;
        }
        cb(selector(item));
      } catch (e) {
        onError(e);
      }
    });
    ch.beforePut((payload, cb) => {
      if (
        payload !== null &&
        typeof payload === 'object' &&
        'syncing' in payload &&
        payload.syncing
      ) {
        cb(payload.value);
        return;
      }
      try {
        if (isGeneratorFunction(reducer)) {
          go(
            reducer,
            genResult => {
              value = genResult;
              syncChildren(ch);
              cb(value);
              logger.log(api, 'STATE_VALUE_SET', value);
            },
            [value, payload],
            id
          );
          return;
        }
        value = reducer(value, payload);
        syncChildren(ch);
        cb(value);
        logger.log(api, 'STATE_VALUE_SET', value);
      } catch (e) {
        onError(e);
      }
    });
    children.push(ch);
    return ch;
  };
  api.select = (selector, onError) =>
    api.chan(selector, DEFAULT_REDUCER, onError);
  api.mutate = (reducer, onError) =>
    api.chan(DEFAULT_SELECTOR, reducer, onError);
  api.destroy = () => {
    children.forEach(ch => sclose(ch));
    value = undefined;
    grid.remove(api);
    logger.log(api, 'STATE_DESTROYED');
    return this;
  };
  api.get = () => value;
  api.set = newValue => {
    value = newValue;
    syncChildren({});
    logger.log(api, 'STATE_VALUE_SET', newValue);
    return newValue;
  };

  logger.log(api, 'STATE_CREATED');

  api.DEFAULT = api.chan();

  grid.add(api);

  return api;
}
