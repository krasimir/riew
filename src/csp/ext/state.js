import { sub, CHANNELS, chan, sput, sclose, buffer } from '../../index';
import { getId, isPromise } from '../../utils';
import { grid } from '../../index';

export function state(...args) {
  let value = args[ 0 ];
  const id = getId('state');
  const readChannels = [];
  const writeChannels = [];
  const isThereInitialValue = args.length > 0;

  function verifyChannel(id) {
    if (CHANNELS.exists(id)) {
      throw new Error(`Channel with name ${id} already exists.`);
    }
  }
  function handleError(onError) {
    return e => {
      if (onError !== null) {
        onError(e);
      } else {
        throw e;
      }
    };
  }
  function runSelector({ ch, selector, onError }, v) {
    let selectorValue;
    try {
      selectorValue = selector(v);
    } catch (e) {
      handleError(onError)(e);
    }
    sput(ch, selectorValue);
  }
  function runWriter({ ch, reducer, onError }, payload) {
    try {
      value = reducer(value, payload);
    } catch (e) {
      handleError(onError)(e);
    }
    if (isPromise(value)) {
      value.then(v => readChannels.forEach(r => runSelector(r, v))).catch(handleError(onError));
    } else {
      readChannels.forEach(r => runSelector(r, value));
    }
  }

  const api = {
    id,
    '@state': true,
    'READ': id + '_read',
    'WRITE': id + '_write',
    select(id, selector = v => v, onError = null) {
      verifyChannel(id);
      let ch = chan(id, buffer.ever());
      let reader = { ch, selector, onError };
      readChannels.push(reader);
      if (isThereInitialValue) {
        runSelector(reader, value);
      }
    },
    mutate(id, reducer = (_, v) => v, onError = null) {
      verifyChannel(id);
      let ch = chan(id, buffer.ever());
      let writer = { ch, reducer, onError };
      writeChannels.push(writer);
      sub(ch, payload => runWriter(writer, payload));
    },
    destroy() {
      readChannels.forEach(({ ch }) => sclose(ch));
      writeChannels.forEach(({ ch }) => sclose(ch));
      value = undefined;
      grid.remove(api);
    },
    get() {
      return value;
    },
    set(newValue) {
      value = newValue;
      readChannels.forEach(r => {
        runSelector(r, value);
      });
    }
  };

  api.select(api.READ);
  api.mutate(api.WRITE);

  grid.add(api);
  return api;
}

export function isState(s) {
  return s && s[ '@state' ] === true;
}
