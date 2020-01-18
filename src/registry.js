/* eslint-disable no-use-before-define */
function Registry() {
  const api = {};
  let products = {};

  api.defineProduct = (type, func) => {
    if (products[type]) {
      throw new Error(`A resource with type "${type}" already exists.`);
    }
    products[type] = func;
  };
  api.undefineProduct = type => {
    if (!products[type]) {
      throw new Error(
        `There is no resource with type "${type}" to be removed.`
      );
    }
    delete products[type];
  };
  api.produce = (type, ...args) => {
    if (!products[type]) {
      throw new Error(`There is no resource with type "${type}".`);
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

const r = Registry();

export default r;
