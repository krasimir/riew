import {
  go,
  sub,
  chan,
  sput,
  sclose,
  buffer,
  isChannel,
  call
} from "../../index";
import { getId, isGeneratorFunction } from "../../utils";
import { grid } from "../../index";

export function createState(...args) {
  let value = args[0];
  const id = getId("state");
  const readChannels = [];
  const writeChannels = [];
  const isThereInitialValue = args.length > 0;

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
        go(selector, v => sput(ch, v), value);
        return;
      }
      sput(ch, selector(v));
    } catch (e) {
      handleError(onError)(e);
    }
  }

  const api = {
    id,
    "@state": true,
    READ: id + "_read",
    WRITE: id + "_write",
    select(id, selector = v => v, onError = null) {
      let ch = isChannel(id) ? id : chan(id, buffer.divorced());
      ch["@statereadchannel"] = true;
      let reader = { ch, selector, onError };
      readChannels.push(reader);
      if (isThereInitialValue) {
        runSelector(reader, value);
      }
      return this;
    },
    mutate(id, reducer = (_, v) => v, onError = null) {
      let ch = isChannel(id) ? id : chan(id, buffer.divorced());
      ch["@statewritechannel"] = true;
      let writer = { ch };
      writeChannels.push(writer);
      sub(
        ch,
        v => {
          value = v;
          readChannels.forEach(r => runSelector(r, value));
        },
        function*(payload) {
          try {
            if (isGeneratorFunction(reducer)) {
              return yield call(reducer, value, payload);
            }
            return reducer(value, payload);
          } catch (e) {
            handleError(onError)(e);
          }
        },
        true,
        handleError(onError)
      );
      return this;
    },
    destroy() {
      readChannels.forEach(({ ch }) => sclose(ch));
      writeChannels.forEach(({ ch }) => sclose(ch));
      value = undefined;
      grid.remove(api);
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
      return newValue;
    }
  };

  api.select(api.READ);
  api.mutate(api.WRITE);

  return api;
}

export function isState(s) {
  return s && s["@state"] === true;
}
export function isStateReadChannel(s) {
  return s && s["@statereadchannel"] === true;
}
export function isStateWriteChannel(s) {
  return s && s["@statewritechannel"] === true;
}
