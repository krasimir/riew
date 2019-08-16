var items = {};
const resolver = (key) => {
  if (items[key]) {
    return items[key];
  }
  throw new Error(`Rine registry: missing "${ key }".`);
};

const Registry = {
  __resolver: resolver,
  set(key, value) {
    items[key] = value;
  },
  get(key) {
    return this.__resolver(key);
  },
  getBulk(arr) {
    return arr.reduce((all, key) => {
      all[key] = this.get(key);
      return all;
    }, {});
  },
  remove(key) {
    delete items[key];
  },
  resolver(r) {
    this.__resolver = r;
  },
  reset() {
    items = {};
    this.__resolver = resolver;
  }
};

export default Registry;
