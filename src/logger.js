/* eslint-disable no-use-before-define */
import { grid, isChannel, isRiew, isState, isRoutine } from './index';
import sanitize from './sanitize';

const MAX_SNAPSHOTS = 100;
const RIEW = 'RIEW';
const STATE = 'STATE';
const CHANNEL = 'CHANNEL';
const ROUTINE = 'ROUTINE';

function normalizeRiew(r) {
  return {
    id: r.id,
    name: r.name,
    type: RIEW,
    viewData: sanitize(r.renderer.data()),
    children: r.children.map(child => {
      if (isState(child)) {
        return normalizeState(child);
      }
      if (isChannel(child)) {
        return normalizeChannel(child);
      }
      if (isRoutine(child)) {
        return normalizeRoutine(child);
      }
      console.warn('Riew logger: unrecognized riew child', child);
    }),
  };
}
function normalizeState(s) {
  return {
    id: s.id,
    type: STATE,
    value: sanitize(s.get()),
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
    value: sanitize(c.value()),
    puts: c.buff.puts.map(({ item }) => ({ item })),
    takes: c.buff.takes.map(({ options }) => ({
      read: options.read,
      listen: options.listen,
    })),
  };
  return o;
}
function normalizeRoutine(r) {
  return {
    id: r.id,
    type: ROUTINE,
    name: r.name,
  };
}

export default function Logger() {
  const api = {};
  let frames = [];
  let data = [];
  let inProgress = false;
  let enabled = false;
  const listeners = [];

  api.on = listener => listeners.push(listener);
  api.log = (who, what, meta) => {
    if (!enabled) return null;
    if (isRiew(who)) {
      who = normalizeRiew(who);
    } else if (isState(who)) {
      who = normalizeState(who);
    } else if (isChannel(who)) {
      who = normalizeChannel(who);
    } else if (isRoutine(who)) {
      who = normalizeRoutine(who);
    } else {
      console.warn('Riew logger: unrecognized who', who, what);
    }
    data.push({
      who,
      what,
      meta: sanitize(meta),
    });
    if (!inProgress) {
      inProgress = true;
      Promise.resolve().then(() => {
        const s = api.snapshot(data);
        inProgress = false;
        data = [];
        listeners.forEach(l => l(s));
      });
    }
  };
  api.snapshot = actions => {
    if (!enabled) return null;
    if (frames.length >= MAX_SNAPSHOTS) {
      frames.shift();
    }
    const riews = [];
    const states = [];
    let filteredStates = [];
    const channels = [];
    let filteredRoutines = [];
    const routines = [];
    let filteredChannels = [];

    grid.nodes().forEach(node => {
      if (isRiew(node)) {
        riews.push(normalizeRiew(node));
      } else if (isState(node)) {
        states.push(normalizeState(node));
      } else if (isChannel(node)) {
        channels.push(normalizeChannel(node));
      } else if (isRoutine(node)) {
        routines.push(normalizeRoutine(node));
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
    filteredRoutines = routines.filter(
      ro => !riews.find(r => r.children.find(({ id }) => ro.id === id))
    );
    const snapshot = sanitize({
      actions,
      state: [
        ...riews,
        ...filteredStates,
        ...filteredChannels,
        ...filteredRoutines,
      ],
    });
    frames.push(snapshot);
    return snapshot;
  };
  api.frames = () => frames;
  api.now = () => (frames.length > 0 ? frames[frames.length - 1] : null);
  api.reset = () => {
    frames = [];
    enabled = false;
  };
  api.enable = () => {
    enabled = true;
  };
  api.disable = () => {
    enabled = false;
  };

  return api;
}
