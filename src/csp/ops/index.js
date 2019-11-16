import pipe from './pipe';
import filter from './filter';
import map from './map';
import takeEvery from './takeEvery';
import f from './from';

const ops = {
  pipe,
  filter,
  map,
  takeEvery,
  from: f
};

export function defineOps(ch) {
  Object.keys(ops).forEach(method => ops[ method ](ch));
}
