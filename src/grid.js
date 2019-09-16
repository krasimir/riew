const NAME = '__@@name';

function Grid() {
  const api = {};
  let nodes = [];

  api.add = (obj) => {
    if (!obj || !obj.id) {
      throw new Error(`Each node in the grid must be an object with "id" field. Instead "${ obj }" given.`);
    }

    nodes.push(obj);
    return api;
  };
  api.get = (identifier) => {
    const node = nodes.find(n => (n[NAME] === identifier || n.id === identifier));

    if (node) {
      return node;
    }
    throw new Error(`A node with identifier "${ identifier }" is missing in the grid.`);
  };
  api.free = (identifier) => {
    nodes = nodes.filter(n => (n[NAME] !== identifier && n.id !== identifier));
  };
  api.reset = () => {
    nodes = [];
    return api;
  };
  api.name = (obj, objName) => {
    const node = api.get(obj.id);

    node[NAME] = objName;
    return api;
  };

  return api;
}

export default Grid();
