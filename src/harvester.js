import createRiew from './riew';
import reactRiew from './react';
import grid from './grid';
import { createChannel, createState } from './csp';

function Harvester() {
  const api = {};
  let products = {};

  api.defineProduct = (type, func) => {
    if (products[ type ]) {
      throw new Error(`A product with type "${type}" already exists.`);
    }
    products[ type ] = func;
  };
  api.undefineProduct = type => {
    if (!products[ type ]) {
      throw new Error(`There is no product with type "${type}" to be removed.`);
    }
    delete products[ type ];
  };
  api.produce = (type, ...args) => {
    if (!products[ type ]) {
      throw new Error(`There is no product with type "${type}".`);
    }
    return products[ type ](...args);
  };
  api.reset = () => {
    products = {};
    defineHarvesterBuiltInCapabilities(api);
  };
  api.debug = () => {
    return {
      productNames: Object.keys(products)
    };
  };

  return api;
}

const defineHarvesterBuiltInCapabilities = function (h) {
  h.defineProduct('riew', (viewFunc, ...controllers) => {
    const riew = createRiew(viewFunc, ...controllers);

    grid.add(riew);
    return riew;
  });
  h.defineProduct('reactRiew', (viewFunc, ...controllers) => {
    return reactRiew(viewFunc, ...controllers);
  });
  h.defineProduct('channel', (...args) => {
    const channel = createChannel(...args);

    grid.add(channel);
    return channel;
  });
  h.defineProduct('state', (...args) => {
    const state = createState(...args);

    grid.add(state);
    return state;
  });
};

const h = Harvester();

defineHarvesterBuiltInCapabilities(h);

export default h;
