import { getId } from '../utils';
import { OPEN } from './constants';
import { CHANNELS, logger, grid } from '../index';
import buffer from './buf';

function normalizeChannelArguments(args) {
  let id;
  let buff;
  if (args.length === 2) {
    id = args[0];
    buff = args[1];
  } else if (args.length === 1 && typeof args[0] === 'string') {
    id = args[0];
    buff = buffer.fixed();
  } else if (args.length === 1 && typeof args[0] === 'object') {
    id = getId('ch');
    buff = args[0];
  } else {
    id = getId('ch');
    buff = buffer.fixed();
  }
  return [id, buff];
}

export function chan(...args) {
  let state = OPEN;
  const [id, buff] = normalizeChannelArguments(args);

  if (CHANNELS.exists(id)) {
    return CHANNELS.get(id);
  }

  const api = CHANNELS.set(id, {
    id,
    '@channel': true,
    subscribers: [],
  });

  api.isActive = () => api.state() === OPEN;
  api.buff = buff;
  api.state = s => {
    if (typeof s !== 'undefined') state = s;
    return state;
  };
  api.value = () => buff.getValue();
  api.beforePut = buff.beforePut;
  api.afterPut = buff.afterPut;
  api.beforeTake = buff.beforeTake;
  api.afterTake = buff.afterTake;
  grid.add(api);
  if (__DEV__) logger.log(api, 'CHANNEL_CREATED');

  return api;
}
