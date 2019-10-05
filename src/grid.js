import { getId } from './utils';

function Subscription(name, callback) {
  return {
    name: name || getId('sub'),
    callback
  };
}

function Grid() {
  const api = {};
  let nodes = [];
  let s11s = {};

  function getSourceSubscriptions(source, type) {
    if (!s11s[source.id]) s11s[source.id] = {};
    if (!s11s[source.id][type]) s11s[source.id][type] = [];
    return s11s[source.id][type];
  }
  function unsubscribe(source, type, subscriptionName) {
    if (!s11s[source.id] || !s11s[source.id][type]) {
      return;
    }
    s11s[source.id][type] = s11s[source.id][type].filter(({ name }) => name !== subscriptionName);
  }
  function off(source) {
    s11s[source.id] = {};
  }

  api.add = (product) => {
    if (!product || !product.id) {
      throw new Error(`Each node in the grid must be an object with "id" field. Instead "${ product }" given.`);
    }
    nodes.push(product);
  };;
  api.remove = (product) => {
    nodes = nodes.filter(({ id }) => id !== product.id);
  };;
  api.reset = () => {
    nodes = [];
    s11s = {};
  };
  api.nodes = () => nodes;
  api.getNodeById = (nodeId) => nodes.find(({ id }) => id === nodeId);
  api.subscribe = (source, type, callback, subscriptionName) => {
    const ss = getSourceSubscriptions(source, type);
    let subscription = ss.find(s => (s.name === subscriptionName || s.callback === callback));

    if (!subscription) {
      ss.push(subscription = Subscription(subscriptionName, callback));
    }
    return () => unsubscribe(source, type, subscription.name);
  };
  api.emit = (source, type, ...args) => {
    getSourceSubscriptions(source, type).forEach(s => s.callback(...args));
  };
  api.off = off;
  api.unsubscribe = unsubscribe;

  return api;
}

const grid = Grid();

export default grid;
