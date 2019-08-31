const Registry = {
  __resources: {},
  add(key, value) {
    this.__resources[key] = value;
  },
  get(key) {
    if (this.__resources[key]) {
      return this.__resources[key];
    }
    throw new Error(`"${ key }" is missing in the registry.`);
  },
  free(key) {
    delete this.__resources[key];
  }
};

export default Registry;
