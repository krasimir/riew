import { go, sub, chan, sput, sclose, buffer, isChannel } from '../../index';
import { getId, isPromise, isGeneratorFunction } from '../../utils';
import { grid } from '../../index';

export function state(...args) {
  let value = args[ 0 ];
  const id = getId('state');
  const readChannels = [];
  const writeChannels = [];
  const isThereInitialValue = args.length > 0;

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
    if (isGeneratorFunction(selector)) {
      go(selector, v => sput(ch, v), value);
      return;
    }
    let selectorValue;
    try {
      selectorValue = selector(v);
    } catch (e) {
      handleError(onError)(e);
    }
    if (isPromise(selectorValue)) {
      selectorValue.then(v => sput(ch, v)).catch(handleError(onError));
    } else {
      sput(ch, selectorValue);
    }
  }
  function runWriter({ ch, reducer, onError }, payload) {
    if (isGeneratorFunction(reducer)) {
      go(
        reducer,
        v => {
          value = v;
          readChannels.forEach(r => runSelector(r, v));
        },
        value,
        payload
      );
      return;
    }
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
      let ch = isChannel(id) ? id : chan(id, buffer.ever());
      ch[ '@statereadchannel' ] = true;
      let reader = { ch, selector, onError };
      readChannels.push(reader);
      if (isThereInitialValue) {
        runSelector(reader, value);
      }
    },
    mutate(id, reducer = (_, v) => v, onError = null) {
      let ch = isChannel(id) ? id : chan(id, buffer.ever());
      ch[ '@statewritechannel' ] = true;
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
export function isStateReadChannel(s) {
  return s && s[ '@statereadchannel' ] === true;
}
export function isStateWriteChannel(s) {
  return s && s[ '@statewritechannel' ] === true;
}
