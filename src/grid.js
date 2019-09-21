function Node(data, parent) {
  return {
    id: data.id,
    parent,
    data,
    is(id) {
      return this.id === id;
    },
    hasParent(parentId) {
      return this.parent === parentId;
    }
  };
}

function Grid() {
  const api = {};
  let nodes = [];

  function getIdsToRemove(identifier) {
    const children = nodes.filter(n => n.hasParent(identifier));

    return [ identifier ].concat(children.reduce((arr, n) => {
      return arr.concat(getIdsToRemove(n.id));
    }, []));
  }

  const add = (obj, parent) => {
    if (!obj || !obj.id) {
      throw new Error(`Each node in the grid must be an object with "id" field. Instead "${ obj }" given.`);
    }

    nodes.push(Node(obj, parent));
    return api;
  };
  const remove = (identifier) => {
    const ids = getIdsToRemove(identifier);
    const removed = [];

    nodes = nodes.filter(n => {
      if (ids.indexOf(n.id) === -1) {
        return true;
      }
      removed.push(n.data);
      return false;
    });
    return removed;
  };
  const get = (identifier) => {
    const node = nodes.find(n => n.is(identifier));

    if (node) {
      return node.data;
    }
    throw new Error(`A node with identifier "${ identifier }" is missing in the grid.`);
  };

  api.get = get;
  api.add = add;
  api.remove = remove;
  api.reset = () => (nodes = []);
  api.nodes = () => nodes;

  return api;
}

const grid = Grid();

export const gridAdd = (node, parent) => grid.add(node, parent);
export const gridRemove = (node) => grid.remove(node.id);
export const gridReset = () => grid.reset();
export const gridGetNode = (identifier) => grid.get(identifier);
export const gridGetNodes = () => grid.nodes();
