import { getId } from './utils';

function Subscription(name, callback) {
  return {
    name: name || getId('sub'),
    callback
  };
}

function Grid() {
  const gridAPI = {};
  let nodes = [];
  let s11s = {};

  function getSubscriptionName(target, source) {
    return `${ target ? target.id : getId('target') }_${ source ? source.id : getId('source') }`;
  }
  function getSourceSubscriptions(source, type) {
    if (!source) {
      return Object.keys(s11s).reduce((ss, sourceId) => {
        ss = ss.concat(s11s[sourceId][type] || []);
        return ss;
      }, []);
    }
    if (!s11s[source.id]) s11s[source.id] = {};
    if (!s11s[source.id][type]) s11s[source.id][type] = [];
    return s11s[source.id][type];
  }

  gridAPI.add = (product) => {
    if (!product || !product.id) {
      throw new Error(`Each node in the grid must be an object with "id" field. Instead "${ product }" given.`);
    }
    nodes.push(product);
  };;
  gridAPI.remove = (product) => {
    let idx = nodes.findIndex(({ id }) => id === product.id);

    if (idx >= 0) {
      nodes.splice(idx, 1);
    }
  };;
  gridAPI.reset = () => {
    nodes = [];
    s11s = {};
  };
  gridAPI.nodes = () => nodes;
  gridAPI.getNodeById = (nodeId) => nodes.find(({ id }) => id === nodeId);
  gridAPI.subscribe = (target) => {
    const api = {};
    let source;

    api.to = x => (source = x, api);
    api.when = (type, callback) => {
      const subscriptionSource = source ? source : { id: getId('sub_actor') };
      const ss = getSourceSubscriptions(subscriptionSource, type);
      const subscriptionName = getSubscriptionName(target, subscriptionSource);
      let subscription = ss.find(s => (s.name === subscriptionName));

      if (!subscription) {
        ss.push(subscription = Subscription(subscriptionName, callback));
      }
      return api;
    };

    return api;
  };
  gridAPI.emit = (type) => {
    const api = {};
    let source;

    api.from = x => (source = x, api);
    api.with = (...args) => {
      getSourceSubscriptions(source, type).forEach(s => s.callback(...args));
    };

    return api;
  };
  gridAPI.unsubscribe = (target) => ({
    from(source) {
      const subscriptionName = getSubscriptionName(target, source);

      if (s11s[source.id]) {
        Object.keys(s11s[source.id]).forEach(type => {
          if (target) {
            let idx = s11s[source.id][type].findIndex(({ name }) => name === subscriptionName);

            if (idx >= 0) {
              s11s[source.id][type].splice(idx, 1);
            }
          } else {
            s11s[source.id][type] = [];
          }
        });
      }
    }
  });
  gridAPI.off = (source) => {
    s11s[source.id] = {};
  };

  return gridAPI;
}

const grid = Grid();

export default grid;
