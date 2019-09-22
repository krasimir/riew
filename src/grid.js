import createEventBus from './eventBus';
import { GRID_ADD, GRID_REMOVE } from './constants';
import { getId } from './utils';
import { implementLoggableInterface } from './interfaces';

const emit = createEventBus();

export function isGridNode(node) {
  return node && node.is && node.hasParent;
};

function Node(product, parentId) {
  const node = {
    id: getId('g'),
    parentId,
    product,
    is(id) {
      return this.product.id === id;
    },
    hasParent(parentId) {
      return this.parentId === parentId;
    }
  };

  implementLoggableInterface(node, product.loggable);

  return node;
}

function Grid() {
  const api = {};
  let nodes = [];

  function getNodesToRemove(productId) {
    return nodes.reduce((arr, node) => {
      if (node.is(productId)) {
        arr.push(node);
      } else if (node.hasParent(productId)) {
        arr = arr.concat(getNodesToRemove(node.product.id));
      }
      return arr;
    }, []);
  }

  const add = (product, parentId) => {
    if (!product || !product.id) {
      throw new Error(`Each node in the grid must be an object with "id" field. Instead "${ product }" given.`);
    }

    let node = Node(product, parentId);

    nodes.push(node);
    emit(GRID_ADD, node);
    return api;
  };
  const remove = (product) => {
    const nodesToRemove = getNodesToRemove(product.id);
    const idsToRemove = nodesToRemove.map(({ id }) => id);
    const removed = [];

    nodes = nodes.filter(n => {
      if (idsToRemove.indexOf(n.id) === -1) {
        return true;
      }
      removed.push(n.product);
      return false;
    });
    emit(GRID_REMOVE, removed);
    return removed;
  };
  const get = (identifier) => {
    const node = nodes.find(n => n.is(identifier));

    if (node) {
      return node.product;
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

export default grid;
