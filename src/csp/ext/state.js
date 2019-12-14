import { sub, channelExists, chan, onSubscriberAdded, onSubscriberRemoved, sput, sclose, buffer } from '../index';
import { getId } from '../../utils';
import { grid } from '../../index';

export function state(...args) {
  let value = args[ 0 ];
  const id = getId('state');
  const readChannels = [];
  const writeChannels = [];
  const isThereInitialValue = args.length > 0;

  function verifyChannel(id) {
    if (channelExists(id)) {
      throw new Error(`Channel with name ${id} already exists.`);
    }
  }

  const api = {
    id,
    '@state': true,
    'READ': id + '_read',
    'WRITE': id + '_write',
    select(id, selector = v => v) {
      verifyChannel(id);
      let ch = chan(id, buffer.broadcasting());
      readChannels.push({ ch, selector });
      onSubscriberAdded(ch, callback => {
        if (isThereInitialValue) {
          callback(selector(value));
        }
      });
      onSubscriberRemoved(ch, callback => {});
    },
    mutate(id, reducer = (_, v) => v) {
      verifyChannel(id, buffer.broadcasting());
      let ch = chan(id);
      writeChannels.push({ ch });
      sub(ch, payload => {
        value = reducer(value, payload);
        readChannels.forEach(r => sput(r.ch, r.selector(value)));
      });
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
      readChannels.forEach(r => sput(r.ch, r.selector(value)));
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
