export const GRID_NAME = '__@@name';
const MAX_NUM_OF_EVENTS = 850;

const ADD_STATE = 'ADD_STATE';
const ADD_NODE = 'ADD_NODE';
const ADD_EFFECT = 'ADD_EFFECT';
const FREE = 'FREE';
const RESET = 'RESET';
const EFFECT_QUEUE_STEP = 'EFFECT_QUEUE_STEP';
const RIEW_RENDER = 'RIEW_RENDER';

function Grid() {
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
    nodes = nodes.filter(n => (n[GRID_NAME] !== identifier && n.id !== identifier));
    return api;
  };
  const get = (identifier) => {
    const node = nodes.find(n => (n[GRID_NAME] === identifier || n.id === identifier));

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
      case FREE:
        free(payload.id);
        break;
      case RESET:
        nodes = [];
        break;
    }
    if (__DEV__) {
      events.push([ type, payload ]);
      if (events.length > MAX_NUM_OF_EVENTS) {
        events.shift();
      }
    }
  };
  api.get = get;
  api.nodes = () => nodes;
  api.events = () => events;

  return api;
}

const grid = Grid();

export const gridAdd = (node) => grid.dispatch(ADD_NODE, node);
export const gridAddState = (state) => grid.dispatch(ADD_STATE, state);
export const gridAddEffect = (node) => grid.dispatch(ADD_EFFECT, node);
export const gridFreeNode = (node) => grid.dispatch(FREE, node);
export const gridReset = () => grid.dispatch(RESET);
export const gridEffectQueueStep = (payload) => grid.dispatch(EFFECT_QUEUE_STEP, payload);
export const gridRiewRender = (payload) => grid.dispatch(RIEW_RENDER, payload);
export const gridGetNode = (identifier) => grid.get(identifier);
export const gridGetNodes = () => grid.nodes();
export const gridGetEvents = () => grid.events();
