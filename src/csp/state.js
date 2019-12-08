import { chan } from './channel';
import { isPromise } from '../utils';

export function state(...args) {
  let value = args[ 0 ];
  let onChange = [];
  let channels = [];
  const createChannel = () => {
    const ch = chan();
    channels.push(ch);
    return ch;
  };
  const api = {
    '@state': true,
    getState() {
      return value;
    },
    set(reducer = (c, v) => v) {
      const ch = createChannel();

      ch.subscribe(newValue => {
        let result = reducer(value, newValue);

        if (isPromise(result)) {
          result.then(v => {
            value = v;
            onChange.forEach(c => c(value));
          });
        } else {
          value = result;
          onChange.forEach(c => c(value));
        }
      });
      return ch;
    },
    map(mapper = v => v) {
      const ch = createChannel();

      onChange.push(value => {
        ch.put(mapper(value));
      });
      if (args.length > 0) {
        ch.put(mapper(value));
      }
      return ch;
    },
    filter(filter) {
      const ch = createChannel();

      onChange.push(value => {
        if (filter(value)) {
          ch.put(value);
        }
      });
      if (filter(value) && args.length > 0) {
        ch.put(value);
      }
      return ch;
    },
    destroy() {
      onChange = [];
      channels.forEach(ch => ch.close());
      channels = [];
    }
  };

  return api;
}

export function isState(s) {
  return s && s[ '@state' ] === true;
}
