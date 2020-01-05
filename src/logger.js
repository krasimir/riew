/* eslint-disable no-use-before-define */
import {
  grid,
  isChannel,
  isRiew,
  isState,
  isStateWriteChannel,
  isStateReadChannel,
} from './index';

const MAX_SNAPSHOTS = 100;
const RIEW = 'RIEW';
const STATE = 'STATE';
const CHANNEL = 'CHANNEL';

function normalizeRiew(r) {
  return {
    id: r.id,
    name: r.name,
    type: RIEW,
    viewData: r.renderer.data(),
    children: r.children.map(child => {
      if (isState(child)) {
        return normalizeState(child);
      }
      if (isChannel(child)) {
        return normalizeChannel(child);
      }
      console.warn('Riew logger: unrecognized riew child', child);
    }),
  };
}
function normalizeState(s) {
  return {
    id: s.id,
    type: STATE,
    value: s.get(),
    children: s.children().map(child => {
      if (isChannel(child)) {
        return normalizeChannel(child);
      }
      console.warn('Riew logger: unrecognized state child', child);
    }),
  };
}
function normalizeChannel(c) {
  const o = {
    id: c.id,
    type: CHANNEL,
    value: c.value(),
    puts: c.buff.puts.map(({ item }) => item),
    takes: c.buff.takes.map(() => 'TAKE'),
  };
  if (isStateWriteChannel(c)) {
    o.stateWrite = true;
  }
  if (isStateReadChannel(c)) {
    o.stateRead = true;
  }
  return o;
}

function Logger() {
  const api = {};
  const snapshots = [];

  api.snapshot = () => {
    if (snapshots.length >= MAX_SNAPSHOTS) {
      snapshots.shift();
    }
    const riews = [];
    const states = [];
    let filteredStates = [];
    const channels = [];
    let filteredChannels = [];
    grid.nodes().forEach(node => {
      if (isRiew(node)) {
        riews.push(normalizeRiew(node));
      } else if (isState(node)) {
        states.push(normalizeState(node));
      } else if (isChannel(node)) {
        channels.push(normalizeChannel(node));
      } else {
        console.warn('Riew logger: unrecognized entity type', node);
      }
    });
    filteredStates = states.filter(
      s => !riews.find(r => r.children.find(({ id }) => s.id === id))
    );
    filteredChannels = channels.filter(
      c =>
        !riews.find(r => r.children.find(({ id }) => c.id === id)) &&
        !states.find(s => s.children.find(({ id }) => c.id === id))
    );
    return [...riews, ...filteredStates, ...filteredChannels];
  };

  return api;
}

export const logger = Logger();
