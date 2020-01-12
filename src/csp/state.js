import {
  go,
  chan,
  sput,
  sclose,
  buffer,
  isChannel,
  grid,
  logger,
} from '../index';
import { getId, isGeneratorFunction } from '../utils';

export function state(...args) {
  let value = args[0];
  const id = getId('state');
  const readChannels = [];
  const writeChannels = [];
  const isThereInitialValue = args.length > 0;
  const READ_CHANNEL = `${id}_read`;
  const WRITE_CHANNEL = `${id}_write`;

  function handleError(onError) {
    return e => {
      if (onError === null) {
        throw e;
      }
      onError(e);
    };
  }
  function runReader({ ch, selector, onError }, v) {
    try {
      if (isGeneratorFunction(selector)) {
        go(selector, routineRes => sput(ch, routineRes), value);
        return;
      }
      sput(ch, selector(v));
    } catch (e) {
      handleError(onError)(e);
    }
  }

  const api = {
    id,
    '@state': true,
    children() {
      return readChannels
        .map(({ ch }) => ch)
        .concat(writeChannels.map(({ ch }) => ch));
    },
    READ: READ_CHANNEL,
    WRITE: WRITE_CHANNEL,
    select(c, selector = v => v, onError = null) {
      const ch = isChannel(c) ? c : chan(c, buffer.memory());
      ch['@statereadchannel'] = true;
      const reader = { ch, selector, onError };
      readChannels.push(reader);
      if (isThereInitialValue) {
        runReader(reader, value);
      }
      return this;
    },
    mutate(c, reducer = (_, v) => v, onError = null) {
      const ch = isChannel(c) ? c : chan(c, buffer.memory());
      ch['@statewritechannel'] = true;
      const writer = { ch };
      writeChannels.push(writer);
      ch.beforePut((payload, resolveBeforePutHook) => {
        try {
          if (isGeneratorFunction(reducer)) {
            go(
              reducer,
              genResult => {
                value = genResult;
                readChannels.forEach(r => runReader(r, value));
                resolveBeforePutHook(value);
                logger.log(api, 'STATE_VALUE_SET', value);
              },
              value,
              payload
            );
            return;
          }
          value = reducer(value, payload);
          readChannels.forEach(r => runReader(r, value));
          resolveBeforePutHook(value);
          logger.log(api, 'STATE_VALUE_SET', value);
        } catch (e) {
          handleError(onError)(e);
        }
      });
      return this;
    },
    destroy() {
      readChannels.forEach(({ ch }) => sclose(ch));
      writeChannels.forEach(({ ch }) => sclose(ch));
      value = undefined;
      grid.remove(api);
      logger.log(api, 'STATE_DESTROYED');
      return this;
    },
    get() {
      return value;
    },
    set(newValue) {
      value = newValue;
      readChannels.forEach(r => {
        runReader(r, value);
      });
      logger.log(api, 'STATE_VALUE_SET', newValue);
      return newValue;
    },
  };

  api.select(api.READ);
  api.mutate(api.WRITE);

  grid.add(api);
  logger.log(api, 'STATE_CREATED');

  return api;
}
