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
  const queue = [];
  const puts = [];
  const takes = [];

  api.put = item => {
    if (queue.length === size) {
      // ...
    };
    queue.push(item);
    if (takes.length > 0) {
      takes.shift()(queue.shift());
    }
  };
  api.take = () => {
    if (queue.length === 0) {
      return new Promise(resolve => {
        takes.push(resolve);
      });
    };
    return Promise.resolve(queue.shift());
  };
  api.size = () => queue.length;

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
