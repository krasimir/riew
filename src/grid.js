function Grid() {
  const api = {};
  let nodes = [];

  const add = (obj) => {
    if (!obj || !obj.id) {
      throw new Error(`Each node in the grid must be an object with "id" field. Instead "${ obj }" given.`);
    }

    nodes.push(obj);
    return api;
  };
  const free = (identifier) => {
    nodes = nodes.filter(n => (n.id !== identifier));
    return api;
  };
  const get = (identifier) => {
    const node = nodes.find(n => (n.id === identifier));

    if (node) {
      return node;
    }
    throw new Error(`A node with identifier "${ identifier }" is missing in the grid.`);
  };

  api.get = get;
  api.add = add;
  api.free = free;
  api.reset = () => (nodes = []);
  api.nodes = () => nodes;

  return api;
}

const grid = Grid();

export const gridAdd = (node) => grid.add(node);
export const gridFreeNode = (node) => grid.free(node.id);
export const gridReset = () => grid.reset();
export const gridGetNode = (identifier) => grid.get(identifier);
export const gridGetNodes = () => grid.nodes();
