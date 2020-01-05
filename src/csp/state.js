import {
  go,
  sread,
  chan,
  sput,
  sclose,
  buffer,
  isChannel,
  call,
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
  function runSelector({ ch, selector, onError }, v) {
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
      const ch = isChannel(c) ? c : chan(c, buffer.divorced());
      ch['@statereadchannel'] = true;
      const reader = { ch, selector, onError };
      readChannels.push(reader);
      if (isThereInitialValue) {
        runSelector(reader, value);
      }
      return this;
    },
    mutate(c, reducer = (_, v) => v, onError = null) {
      const ch = isChannel(c) ? c : chan(c, buffer.divorced());
      ch['@statewritechannel'] = true;
      const writer = { ch };
      writeChannels.push(writer);
      sread(
        ch,
        v => {
          value = v;
          readChannels.forEach(r => runSelector(r, value));
          if (__DEV__) logger.log(api, 'STATE_VALUE_SET', value);
        },
        {
          *transform(payload) {
            try {
              if (isGeneratorFunction(reducer)) {
                return yield call(reducer, value, payload);
              }
              return reducer(value, payload);
            } catch (e) {
              handleError(onError)(e);
            }
          },
          onError: handleError(onError),
          initialCall: true,
          listen: true,
        }
      );
      return this;
    },
    destroy() {
      readChannels.forEach(({ ch }) => sclose(ch));
      writeChannels.forEach(({ ch }) => sclose(ch));
      value = undefined;
      grid.remove(api);
      if (__DEV__) logger.log(api, 'STATE_DESTROYED');
      return this;
    },
    get() {
      return value;
    },
    set(newValue) {
      value = newValue;
      readChannels.forEach(r => {
        runSelector(r, value);
      });
      if (__DEV__) logger.log(api, 'STATE_VALUE_SET', newValue);
      return newValue;
    },
  };

  api.select(api.READ);
  api.mutate(api.WRITE);

  grid.add(api);
  if (__DEV__) logger.log(api, 'STATE_CREATED');

  return api;
}
