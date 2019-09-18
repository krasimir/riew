import gridRaw from './grid';
import harvester from './harvester';

export const state = (initialValue) => {
  return harvester.produce('state', initialValue);
};
export const merge = (statesMap) => {
  return harvester.produce('mergeStates', statesMap);
};
export const riew = (...args) => {
  return harvester.produce('riew', ...args);
};
export const react = {
  riew: (...args) => {
    return harvester.produce('reactRiew', ...args);
  }
};
export const use = (name, ...args) => {
  return harvester.produce(name, ...args);
};

export const grid = gridRaw;
export { compose, serial, parallel } from './utils';
