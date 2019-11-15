import pipe from "./pipe";
import filter from "./filter";
import map from "./map";

const ops = {
  pipe,
  filter,
  map
};

export function defineOperations(ch) {
  Object.keys(ops).forEach(method => ops[method](ch));
}
