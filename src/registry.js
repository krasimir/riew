/* eslint-disable no-use-before-define */
function Harvester() {
  const api = {};
  let products = {};

  api.defineProduct = (type, func) => {
    if (products[type]) {
      throw new Error(`A product with type "${type}" already exists.`);
    }
    products[type] = func;
  };
  api.undefineProduct = type => {
    if (!products[type]) {
      throw new Error(`There is no product with type "${type}" to be removed.`);
    }
    delete products[type];
  };
  api.produce = (type, ...args) => {
    if (!products[type]) {
      throw new Error(`There is no product with type "${type}".`);
    }
    return products[type](...args);
  };
  api.reset = () => {
    products = {};
  };
  api.debug = () => ({
    productNames: Object.keys(products),
  });

  return api;
}

const h = Harvester();

export default h;
