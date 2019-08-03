import System from './System';

var ids = 0;
const getId = () => `s${ ++ids }`;

export default function createStateController(initialValue, reducer) {
  let subscribersUID = 0;
  let stateValue = initialValue;
  let subscribers = [];

  const stateController = {
    __state: 'rine',
    __subscribers: subscribers,
    id: getId(),
    set(newValue) {
      stateValue = newValue;
      subscribers.forEach(({ update }) => update(stateValue));
    },
    get() {
      return stateValue;
    },
    connect(update) {
      const subscriberId = ++subscribersUID;

      subscribers.push({ id: subscriberId, update });
      return () => {
        this.__subscribers = subscribers = subscribers.filter(({ id }) => id !== subscriberId);
      };
    },
    destroy() {
      System.removeController(this);
    },
    put(type, payload) {
      if (reducer) {
        this.set(reducer(stateValue, { type, payload }));
      }
    }
  };

  System.addController(stateController);

  return stateController;
};
