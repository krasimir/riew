const NAME = '__@@name';
const MAX_NUM_OF_EVENTS = 500;

const ADD_STATE = 'ADD_STATE';
const ADD_NODE = 'ADD_NODE';
const ADD_EFFECT = 'ADD_EFFECT';
const DESTROY = 'DESTROY';
const RESET = 'RESET';
const SET_NAME = 'SET_NAME';

function Grid() {
  const debug = __DEV__;
  const api = {};
  let nodes = [];
  let events = [];

  const add = (obj) => {
    if (!obj || !obj.id) {
      throw new Error(`Each node in the grid must be an object with "id" field. Instead "${ obj }" given.`);
    }

    nodes.push(obj);
    return api;
  };
  const free = (identifier) => {
    nodes = nodes.filter(n => (n[NAME] !== identifier && n.id !== identifier));
    return api;
  };
  const get = (identifier) => {
    const node = nodes.find(n => (n[NAME] === identifier || n.id === identifier));

    if (node) {
      return node;
    }
    throw new Error(`A node with identifier "${ identifier }" is missing in the grid.`);
  };

  api.dispatch = (type, payload) => {
    switch (type) {
      case ADD_STATE:
      case ADD_NODE:
      case ADD_EFFECT:
        add(payload);
        break;
      case DESTROY:
        free(payload);
        break;
      case RESET:
        nodes = [];
        break;
      case SET_NAME:
        const node = get(payload[0].id);

        node[NAME] = payload[1];
        break;
    }
    if (debug) {
      events.push([type, payload]);
      if (events.length > MAX_NUM_OF_EVENTS) {
        events.shift();
      }
    }
  };
  api.get = get;
  api.nodes = () => nodes;

  return api;
}

const grid = Grid();

export const gridAddState = (state) => grid.dispatch(ADD_STATE, state);
export const gridAddNode = (node) => grid.dispatch(ADD_NODE, node);
export const gridAddEffect = (node) => grid.dispatch(ADD_EFFECT, node);
export const gridDestroy = (node) => grid.dispatch(DESTROY, node);
export const gridReset = () => grid.dispatch(RESET);
export const gridSetNodeName = (node, name) => grid.dispatch(SET_NAME, [ node, name ]);
export const gridGetNode = (identifier) => grid.get(identifier);
export const gridGetNodes = () => grid.nodes();
