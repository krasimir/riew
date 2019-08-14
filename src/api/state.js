import System from './System';

var ids = 0;
const getId = () => `@@s${ ++ids }`;

export const teardownAction = id => `${ id }_teardown`;
export const isState = (state) => state && state.__rine === 'state';

export default function createState(initialValue, reducer) {
  let subscribersUID = 0;
  let stateValue = initialValue;
  let subscribers = [];
  let reducerTask;

  const state = function (newValue) {
    if (typeof newValue !== 'undefined') {
      state.set(newValue);
    }
    return state.get();
  };

  state.__rine = 'state';
  state.__subscribers = () => {
    return subscribers;
  };
  state.id = getId();
  state.set = (newValue) => {
    stateValue = newValue;
    subscribers.forEach(({ update }) => update(stateValue));
  };
  state.get = () => {
    return stateValue;
  };
  state.subscribe = (update) => {
    const subscriberId = ++subscribersUID;

    subscribers.push({ id: subscriberId, update });
    return () => {
      subscribers = subscribers.filter(({ id }) => id !== subscriberId);
    };
  };
  state.teardown = () => {
    subscribers = [];
    stateValue = undefined;
  };
  state.put = (type, payload) => {
    if (reducer) {
      state.set(reducer(stateValue, { type, payload }));
    }
  };

  if (reducer) {
    reducerTask = System.takeEvery('*', (payload, type) => state.put(type, payload));
  }

  System.addTask(teardownAction(state.id), () => {
    state.teardown();
    if (reducerTask) {
      reducerTask.cancel();
    }
  });

  return state;
};
