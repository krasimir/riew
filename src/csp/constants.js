export const OPEN = Symbol('OPEN');
export const CLOSED = Symbol('CLOSED');
export const ENDED = Symbol('ENDED');
export const PUT = 'PUT';
export const TAKE = 'TAKE';
export const NOOP = 'NOOP';
export const SLEEP = 'SLEEP';
export const STOP = 'STOP';
export const SUB = 'SUB';
export const CALL_ROUTINE = 'CALL_ROUTINE';
export const FORK_ROUTINE = 'FORK_ROUTINE';

export const CHANNELS = {
  channels: {},
  getAll() {
    return this.channels;
  },
  get(id) {
    return this.channels[id];
  },
  set(id, ch) {
    this.channels[id] = ch;
    return ch;
  },
  del(id) {
    delete this.channels[id];
  },
  exists(id) {
    return !!this.channels[id];
  },
  reset() {
    this.channels = {};
  },
};
