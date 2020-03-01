import { getId, setProp } from '../utils';
import { CHANNELS, logger, grid, OPEN, register } from '../index';
import buffer from './buf';

export default function chan(id, buff, parent = null) {
  let state = OPEN;

  id = id ? getId(id) : getId('ch');
  buff = buff || buffer.fixed();

  if (CHANNELS.exists(id)) {
    throw new Error(`Channel with id "${id}" already exists.`);
  }

  const channel = function(str, name) {
    if (str.length > 1) {
      setProp(channel, 'name', str[0] + name + str[1]);
    } else {
      setProp(channel, 'name', str[0]);
    }
    logger.setWhoName(channel.id, channel.name);
    return channel;
  };
  channel.id = id;
  channel['@channel'] = true;
  channel.parent = parent;
  const api = CHANNELS.set(id, channel);

  buff.parent = api;

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
