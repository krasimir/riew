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
  const api = {};

  const doneMutation = value => {
    api.set(value);
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

  api.__rine = 'state';
  api.__subscribers = () => {
    return subscribers;
  };
  api.id = getId();
  api.set = (newValue) => {
    stateValue = newValue;
    subscribers.forEach(({ update }) => update(stateValue));
    return newValue;
  };
  api.get = () => {
    return stateValue;
  };
  api.subscribe = (update) => {
    const subscriberId = ++subscribersUID;

    subscribers.push({ id: subscriberId, update });
    return () => {
      subscribers = subscribers.filter(({ id }) => id !== subscriberId);
    };
  };
  api.teardown = () => {
    System.put(teardownAction(api.id));
  };
  api.mutation = (reducer, ...types) => {
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

  System.addTask(teardownAction(api.id), () => {
    subscribers = [];
    stateValue = undefined;
    if (reducerTasks.length > 0) {
      reducerTasks.forEach(t => t.cancel());
    }
  });

  return api;
};
