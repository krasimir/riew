import { getId } from '../utils';

const CHANNEL = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  ENDED: 'ENDED'
};
const BUFFER = {
  BLOCK: 'BLOCK',
  ITEM_ACCEPTED: 'ITEM_ACCEPTED'
};

function Buffer(size = 1) {
  const api = {};
  const items = [];
  const puts = [];
  const takes = [];

  api.isEmpty = () => items.length === 0;
  api.put = item => {
    if (takes.length === 0) {
      return new Promise(resolve => {
        puts.push([ resolve, item ]);
      });
    };
    items.push(item);
    return new Promise(resolve => {
      Promise.resolve().then(() => {
        resolve();
        takes.shift()(items.shift());
      });
    });
  };
  api.take = () => {
    if (api.isEmpty()) {
      if (puts.length > 0) {
        const [ resolve, item ] = puts.shift();

        items.push(item);
        resolve();
        return api.take();
      }
      return new Promise(resolve => {
        takes.push(resolve);
      });
    };
    return Promise.resolve(items.shift());
  };
  api.size = () => items.length;

  return api;
}

export function chan(id) {
  if (typeof id === 'undefined') id = getId('ch');
  let state = CHANNEL.OPEN;
  const api = { id };
  const buffer = Buffer();

  api.put = (item) => {
    return buffer.put(item);
  };
  api.take = () => {
    return buffer.take();
  };

  return api;
};
