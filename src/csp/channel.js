import { getId } from '../utils';
import { CHANNELS, logger, grid, OPEN, register } from '../index';
import buffer from './buf';

export default function chan(id, buff) {
  let state = OPEN;

  id = id || getId('ch');
  buff = buff || buffer.fixed();

  if (CHANNELS.exists(id)) {
    throw new Error(`Channel with id "${id}" already exists.`);
  }

  const api = CHANNELS.set(id, {
    id,
    '@channel': true,
  });

  buff.parent = api.id;

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
  api.exportAs = key => register(key, api);
  grid.add(api);
  logger.log(api, 'CHANNEL_CREATED');

  return api;
}
