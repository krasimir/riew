import { halt, pub, sub, unsub } from '../index';
import { getId } from '../../utils';

export function state(...args) {
  let value = args[ 0 ];
  const api = { '@state': true, 'id': getId('state') };
  const LISTENERS = api.id + '_LISTENERS';
  const WRITERS = api.id + '_WRITERS';

  sub(WRITERS, newValue => {
    value = newValue;
    pub(LISTENERS, newValue);
  });

  api.select = func => () => func(value);
  api.mutation = func => payload => pub(WRITERS, func(value, payload));
  api.sub = (func, immediate = false) => {
    sub(LISTENERS, func);
    if (immediate) {
      func(value);
    }
  };
  api.unsub = func => unsub(LISTENERS, func);
  api.destroy = () => {
    halt(LISTENERS);
    halt(WRITERS);
    api.select = api.mutation = () => () => {};
    api.sub = api.unsub = api.get = api.set = () => {};
    value = null;
  };

  api.get = api.select(v => v);
  api.set = api.mutation((_, newValue) => newValue);

  return api;
}

export function isState(s) {
  return s && s[ '@state' ] === true;
}
