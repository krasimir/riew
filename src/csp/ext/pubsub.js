import { chan } from '../index';

let topics = {};
const noop = () => {};

function Topic(key) {
  if (topics[ key ]) {
    return topics[ key ];
  }

  let subscribers = [];
  let isListening = false;
  let ch = chan(key);
  let onSubscriberAddedCallback = noop;
  let onSubscriberRemovedCallback = noop;

  return (topics[ key ] = {
    ch,
    addSubscriber(callback) {
      if (!subscribers.find(c => c === callback)) {
        subscribers.push(callback);
        onSubscriberAddedCallback(callback);
      }
      return this;
    },
    removeSubscriber(callback) {
      subscribers = subscribers.filter(c => {
        if (c !== callback) {
          return true;
        }
        onSubscriberRemovedCallback(c);
        return false;
      });
      return this;
    },
    listen() {
      if (!isListening) {
        isListening = true;
        (function taker() {
          ch.take(value => {
            if (value !== chan.CLOSED && value !== chan.ENDED) {
              subscribers.forEach(callback => callback(value));
              taker();
            }
          });
        })();
      }
    },
    publish(payload, callback) {
      ch.put(payload, callback);
      return this;
    },
    halt() {
      ch.close();
      subscribers = [];
      return this;
    },
    onSubscriberAdded(callback) {
      onSubscriberAddedCallback = callback;
      return this;
    },
    onSubscriberRemoved(callback) {
      onSubscriberRemovedCallback = callback;
      return this;
    }
  });
}

export const topic = key => Topic(key);
export const sub = (key, callback) =>
  Topic(key)
    .addSubscriber(callback)
    .listen();
export const pub = (key, payload, callback) =>
  Topic(key)
    .publish(payload, callback)
    .listen();
export const unsub = (key, callback) => Topic(key).removeSubscriber(callback);
export const haltAll = () => {
  Object.keys(topics).forEach(key => topics[ key ].halt());
  topics = {};
};
export const halt = key => {
  if (topics[ key ]) {
    topics[ key ].halt();
    delete topics[ key ];
  }
};
export const getTopics = () => topics;
export const topicExists = key => !!topics[ key ];
