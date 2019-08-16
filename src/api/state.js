/* eslint-disable no-use-before-define, no-return-assign */
import System from './System';
import { isPromise } from '../utils';

var ids = 0;
const getId = () => `@@s${ ++ids }`;

export const teardownAction = id => `${ id }_teardown`;
export const isState = (state) => state && state.__rine === 'state';

export default function createState(initialValue) {
  let subscribersUID = 0;
  let stateValue = initialValue;
  let subscribers = [];
  let reducerTasks = [];
  let mutations = [];
  let mutationInProgress = false;

  const state = function (newValue) {
    if (typeof newValue !== 'undefined') {
      state.set(newValue);
    }
    return state.get();
  };
  const doneMutation = value => {
    state.set(value);
    mutationInProgress = false;
    processMutations();
  };
  const processMutations = () => {
    if (mutations.length === 0 || mutationInProgress) return;
    mutationInProgress = true;

    const { reducer, payload, done } = mutations.shift();
    const result = reducer(stateValue, payload);

    if (isPromise(result)) {
      result.then(value => {
        done(value);
        doneMutation(value);
      });
    } else {
      done(result);
      doneMutation(result);
    }
  };

  state.__rine = 'state';
  state.__subscribers = () => {
    return subscribers;
  };
  state.id = getId();
  state.set = (newValue) => {
    stateValue = newValue;
    subscribers.forEach(({ update }) => update(stateValue));
    return newValue;
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
    System.put(teardownAction(state.id));
  };
  state.mutation = (reducer, ...types) => {
    if (types.length > 0) {
      types.forEach(type => {
        reducerTasks.push(
          System.takeEvery(type, (payload) => {
            mutations.push({ reducer, payload, done: () => {} });
            processMutations();
          })
        );
      });
    }
    return payload => {
      return new Promise(done => {
        mutations.push({ reducer, payload, done });
        processMutations();
      });
    };
  };

  System.addTask(teardownAction(state.id), () => {
    subscribers = [];
    stateValue = undefined;
    if (reducerTasks.length > 0) {
      reducerTasks.forEach(t => t.cancel());
    }
  });

  return state;
};
