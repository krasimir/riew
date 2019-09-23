function Grid() {
  const api = {};
  let nodes = [];

  const add = (product) => {
    if (!product || !product.id) {
      throw new Error(`Each node in the grid must be an object with "id" field. Instead "${ product }" given.`);
    }
    nodes.push(product);
  };
  const remove = (product) => {
    nodes = nodes.filter(({ id }) => id !== product.id);
  };

  api.add = add;
  api.remove = remove;
  api.reset = () => (nodes = []);
  api.nodes = () => nodes;

  return api;
}

const grid = Grid();

export default grid;
