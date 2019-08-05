import System from './System';

var ids = 0;
const getId = () => `@@s${ ++ids }`;

export const teardownAction = id => `${ id }_teardown`;
export const isState = (state) => state && state.__rine === 'state';

export default function createState(initialValue, reducer) {
  let subscribersUID = 0;
  let stateValue = initialValue;
  let subscribers = [];

  const state = {
    __rine: 'state',
    __subscribers() {
      return subscribers;
    },
    id: getId(),
    set(newValue) {
      stateValue = newValue;
      subscribers.forEach(({ update }) => update(stateValue));
    },
    get() {
      return stateValue;
    },
    subscribe(update) {
      const subscriberId = ++subscribersUID;

      subscribers.push({ id: subscriberId, update });
      return () => {
        subscribers = subscribers.filter(({ id }) => id !== subscriberId);
      };
    },
    teardown() {
      subscribers = [];
      stateValue = undefined;
    },
    put(type, payload) {
      if (reducer) {
        this.set(reducer(stateValue, { type, payload }));
      }
    }
  };

  System.addTask(teardownAction(state.id), () => {
    state.teardown();
  });

  return state;
};
