import {
  chan,
  isChannel,
  isStateReadChannel,
  buffer,
  isState
} from "../../index";
import { SUB } from "../constants";
import { sput, stake } from "../ops";

const NOTHING = Symbol("Nothing");

function normalizeChannels(channels) {
  if (!Array.isArray(channels)) channels = [channels];
  return channels.map((ch, idx) => {
    if (isState(ch)) ch = ch.READ;
    return isChannel(ch) ? ch : chan(ch);
  });
}
function normalizeTo(to) {
  if (typeof to === "function") {
    return to;
  } else if (isChannel(to)) {
    return to.__subFunc || (to.__subFunc = v => sput(to, v));
  } else if (typeof to === "string") {
    const ch = chan(to, buffer.ever());
    return (ch.__subFunc = v => sput(to, v));
  }
  throw new Error(
    `'sub' accepts string, channel or a function as a second argument. ${to} given.`
  );
}
function defaultTransform(...args) {
  if (args.length === 1) return args[0];
  return args;
}

export function sub(
  channels,
  to,
  transform = defaultTransform,
  initialCallIfBufValue = true
) {
  // in a routine
  if (typeof to === "undefined") {
    return { ch: channels, op: SUB };
  }

  // outside routine
  channels = normalizeChannels(channels); // array of channels
  to = normalizeTo(to); // function

  const data = channels.map(() => NOTHING);
  let composedAtLeastOnce = false;
  channels.forEach((ch, idx) => {
    const notify = value => {
      data[idx] = value;
      if (composedAtLeastOnce || data.length === 1 || !data.includes(NOTHING)) {
        composedAtLeastOnce = true;
        to(transform(...data));
      }
    };
    if (!ch.subscribers.find(({ to: t }) => t === to)) {
      ch.subscribers.push({ to, notify });
    }
    // If there is already a value in the channel
    // notify the subscribers.
    const currentChannelBufValue = ch.value();
    if (initialCallIfBufValue && currentChannelBufValue.length > 0) {
      notify(currentChannelBufValue[0]);
    }
  });
  return to;
}

export function subOnce(id, callback) {
  let ch = isChannel(id) ? id : chan(id);
  let c = v => {
    unsub(id, callback);
    callback(v);
  };
  if (!ch.subscribers.find(s => s === c)) {
    ch.subscribers.push({ notify: c, to: callback });
  }
}
export function unsub(id, callback) {
  let ch = isChannel(id) ? id : chan(id);
  ch.subscribers = ch.subscribers.filter(({ to }) => {
    if (to !== callback) {
      return true;
    }
    return false;
  });
}

export function read(...args) {
  return sub(...args);
}
