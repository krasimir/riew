function Grid() {
  const api = {};
  let nodes = [];
  let listeners = {};

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
  api.getNodeById = (nodeId) => nodes.find(({ id }) => id === nodeId);
  api.on = (type, callback) => {
    if (!listeners[type]) listeners[type] = [];
    listeners[type].push(callback);
    return () => (listeners[type] = listeners[type].filter(c => c !== callback));
  };
  api.emit = (type, source, ...args) => {
    if (!listeners[type]) return;
    listeners[type].forEach(l => l(source, ...args));
  };

  return api;
}

const grid = Grid();

export default grid;
