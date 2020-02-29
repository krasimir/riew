/* eslint-disable no-use-before-define */
import { isChannel, isRiew, isState, isRoutine } from './index';
import sanitize from './sanitize';

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
    parent: s.parent,
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
    name: c.name,
    parent: c.parent,
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
    parent: r.parent,
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
        const s = api.frame(data);
        inProgress = false;
        data = [];
        listeners.forEach(l => l(s));
      });
    }
  };
  api.frame = actions => {
    if (!enabled) return null;
    const frame = sanitize(actions);
    frames.push(frame);
    return frame;
  };
  api.now = () => (frames.length > 0 ? frames[frames.length - 1] : null);
  api.frames = () => frames;
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
