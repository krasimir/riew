function Grid() {
  const api = {};
  let nodes = [];
  let listeners = [];

  api.add = (product) => {
    if (!product || !product.id) {
      throw new Error(`Each node in the grid must be an object with "id" field. Instead "${ product }" given.`);
    }
    nodes.push(product);
  };;
  api.remove = (product) => {
    nodes = nodes.filter(({ id }) => id !== product.id);
  };;
  api.reset = () => {
    nodes = [];
    listeners = [];
  };
  api.nodes = () => nodes;
  api.on = (listener) => listeners.push(listener);
  api.dispatch = (...args) => listeners.forEach(l => l(...args));

  return api;
}

const grid = Grid();

export default grid;
