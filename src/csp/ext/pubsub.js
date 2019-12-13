import { chan, isChannel } from '../index';

let topics = {};
const noop = () => {};

function Topic(key) {
  let ch;
  if (isChannel(key)) {
    ch = key;
    key = ch.id;
  } else {
    ch = chan(key.toString());
  }
  if (topics[ key ]) {
    return topics[ key ];
  }

  let subscribers = [];
  let isListening = false;
  let onSubscriberAddedCallback = noop;
  let onSubscriberRemovedCallback = noop;

  let listen = () => {
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
  };

  return (topics[ key ] = {
    ch,
    sub(callback) {
      if (!subscribers.find(c => c === callback)) {
        subscribers.push(callback);
        onSubscriberAddedCallback(callback);
      }
      listen();
    },
    unsub(callback) {
      subscribers = subscribers.filter(c => {
        if (c !== callback) {
          return true;
        }
        onSubscriberRemovedCallback(c);
        return false;
      });
      return this;
    },
    put(...args) {
      listen();
      return ch.put(...args);
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
export const sub = (key, callback) => Topic(key).sub(callback);
export const unsub = (key, callback) => Topic(key).unsub(callback);
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
