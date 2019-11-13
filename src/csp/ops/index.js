import pipe from './pipe';
import filter from './filter';
import map from './map';

const ops = {
  pipe,
  filter,
  map,
};

export function defineOperations(api) {
  Object.keys(ops).forEach(method => ops[method](api));
}
export function chainOperations(api) {
  let putter = v => api.put(v);

  Object.keys(ops).forEach(method => (putter[method] = api[method]));
  return putter;
}
