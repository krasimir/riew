const Registry = {
  __resources: {},
  __resolver(key) {
    if (this.__resources[key]) {
      return this.__resources[key];
    }
    throw new Error(`"${ key }" is missing in the registry.`);
  },
  __dissolver(key) {
    delete this.__resources[key];
    return key;
  },
  add(key, value) {
    this.__resources[key] = value;
  },
  get(key) {
    return this.__resolver(key);
  },
  free(key) {
    return this.__dissolver(key);
  },
  custom({ resolver, dissolver }) {
    this.__resolver = resolver;
    this.__dissolver = dissolver;
  }
};

export default Registry;
