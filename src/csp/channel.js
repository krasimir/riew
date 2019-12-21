import { getId } from "../utils";
import { OPEN } from "./constants";
import { grid, CHANNELS } from "../index";
import buffer from "./buffer";

export function createChannel(...args) {
  let state = OPEN;
  let [id, buff] = normalizeChannelArguments(args);

  if (CHANNELS.exists(id)) {
    return CHANNELS.get(id);
  }

  let api = CHANNELS.set(id, {
    id,
    "@channel": true,
    subscribers: []
  });

  api.isActive = () => api.state() === OPEN;
  api.buff = buff;
  api.state = s => {
    if (typeof s !== "undefined") state = s;
    return state;
  };
  api.value = () => {
    return buff.getValue();
  };

  return api;
}

function normalizeChannelArguments(args) {
  let id, buff;
  if (args.length === 2) {
    id = args[0];
    buff = args[1];
  } else if (args.length === 1 && typeof args[0] === "string") {
    id = args[0];
    buff = buffer.fixed();
  } else if (args.length === 1 && typeof args[0] === "object") {
    id = getId("ch");
    buff = args[0];
  } else {
    id = getId("ch");
    buff = buffer.fixed();
  }
  return [id, buff];
}
