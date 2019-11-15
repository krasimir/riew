import pipe from './pipe';
import filter from './filter';
import map from './map';
import takeEvery from './takeEvery';

const ops = {
  pipe,
  filter,
  map,
  takeEvery
};

export function defineOperations(ch) {
  Object.keys(ops).forEach(method => ops[method](ch));
}
