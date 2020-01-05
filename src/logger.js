/* eslint-disable no-use-before-define */
import { grid, isChannel, isRiew, isState } from './index';

const MAX_SNAPSHOTS = 100;
const RIEW = 'RIEW';
const STATE = 'STATE';
const CHANNEL = 'CHANNEL';

function normalizeRiew(r) {
  return {
    id: r.id,
    name: r.name,
    type: RIEW,
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
    children: s.children().map(child => {
      if (isChannel(child)) {
        return normalizeChannel(child);
      }
      console.warn('Riew logger: unrecognized state child', child);
    }),
  };
}
function normalizeChannel(c) {
  return {
    id: c.id,
    type: CHANNEL,
  };
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
    console.log(`nodes: ${grid.nodes().length}`);
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
    const snapshot = [...riews, ...filteredStates, ...filteredChannels];

    console.log('----------');
    console.log(JSON.stringify(snapshot, null, 2));
  };

  return api;
}

export const logger = Logger();
