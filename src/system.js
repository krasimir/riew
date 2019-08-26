function normalizeState(state) {
  const value = state.__get();
  const queues = state.__queues().map(q => {
    return {
      index: q.index,
      result: q.result,
      items: q.items.map(({ type, name }) => `${ name.join(',') }(${ type })`)
    };
  });

  return { value, queues };
};

const System = {
  __states: [],
  onStateCreated(state) {
    this.__states.push(state);
  },
  onStateTeardown(state) {
    this.__states = this.__states.filter(({ id }) => id === state.id);
  },
  snapshot() {
    return this.__states.map(normalizeState);
  }
};

export default System;
