/* eslint-disable no-use-before-define */
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
  const isThereInitialValue = args.length > 0;
  const readChannels = [];
  const writeChannels = [];
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
  function runReducer(reducerFunc, payload, callback) {
    if (isGeneratorFunction(reducerFunc)) {
      go(
        reducerFunc,
        reducerValue => {
          value = reducerValue;
          callback(value);
          if (__DEV__) logger.log(api, 'STATE_VALUE_SET', value);
        },
        value,
        payload
      );
    } else {
      value = reducerFunc(value, payload);
      callback(value);
      if (__DEV__) logger.log(api, 'STATE_VALUE_SET', value);
    }
  }
  function runSelector(selector, callback, onError) {
    try {
      if (isGeneratorFunction(selector)) {
        go(selector, routineRes => callback(routineRes), value);
        return;
      }
      callback(selector(value));
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
      const behavior = {
        value: [],
        onPut(getItem, callback) {
          this.value = [getItem()];
          callback(true);
        },
        onTake(callback) {
          callback(this.value[0]);
        },
      };
      runSelector(selector, v => (behavior.value = [v]), onError);
      const ch = isChannel(c) ? c : chan(c, buffer.divorced(behavior));
      ch['@statereadchannel'] = true;
      readChannels.push({ ch, selector, onError });
      if (isThereInitialValue) {
        // put to channels
      }
      return this;
    },
    mutate(c, reducer = (_, v) => v, onError = null) {
      const behavior = {
        value: [],
        onPut(getItem, callback) {
          try {
            runReducer(reducer, getItem(), v => {
              this.value = [v];
              readChannels.forEach(r => {
                runSelector(r.selector, va => sput(r.ch, va), r.onError);
              });
              callback(true);
            });
          } catch (e) {
            handleError(onError)(e);
          }
        },
        onTake(callback) {
          callback(this.value[0]);
        },
      };
      const ch = chan(c, buffer.divorced());
      ch.buff.addBehavior(behavior);
      ch['@statewritechannel'] = true;
      const writer = { ch };
      writeChannels.push(writer);

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
      readChannels.forEach(({ ch, selector, onError }) => {
        runSelector(selector, v => sput(ch, v), onError);
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
