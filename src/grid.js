export default function Grid() {
  const gridAPI = {};
  let nodes = [];

  gridAPI.add = product => {
    if (!product || !product.id) {
      throw new Error(
        `Each node in the grid must be an object with "id" field. Instead "${product}" given.`
      );
    }
    nodes.push(product);
  };
  gridAPI.remove = product => {
    const idx = nodes.findIndex(({ id }) => id === product.id);

    if (idx >= 0) {
      // splice because of https://krasimirtsonev.com/blog/article/foreach-or-not-to-foreach
      nodes.splice(idx, 1);
    }
  };
  gridAPI.reset = () => {
    nodes = [];
  };
  gridAPI.nodes = () => nodes;
  gridAPI.getNodeById = nodeId => nodes.find(({ id }) => id === nodeId);

  return gridAPI;
}
