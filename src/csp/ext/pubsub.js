import { chan } from '../index';

let topics = {};

export const topic = key => {
  if (!topics[ key ]) {
    topics[ key ] = {
      ch: chan(key),
      subscribers: [],
      listen: false
    };
  }
  return topics[ key ].ch;
};
export const sub = (key, callback) => {
  topic(key);
  if (!topics[ key ].subscribers.find(c => c === callback)) {
    topics[ key ].subscribers.push(callback);
  }
  listen(key);
};
export const pub = (key, payload, callback) => {
  topic(key);
  topics[ key ].ch.put(payload, callback);
  listen(key);
};

export const unsub = (topic, callback) => {
  if (topics[ topic ]) {
    topics[ topic ].subscribers = topics[ topic ].subscribers.filter(c => c !== callback);
  }
};
export const haltAll = () => {
  Object.keys(topics).forEach(topic => topics[ topic ].ch.close());
  topics = {};
};
export const halt = topic => {
  if (topics[ topic ]) {
    topics[ topic ].ch.close();
    delete topics[ topic ];
  }
};
export const getTopics = () => {
  return topics;
};
export const topicExists = topic => {
  return !!topics[ topic ];
};

const listen = key => {
  if (topics[ key ] && topics[ key ].listen === false) {
    topics[ key ].listen = true;
    (function taker() {
      topics[ key ].ch.take(value => {
        if (value !== chan.CLOSED && value !== chan.ENDED) {
          topics[ key ].subscribers.forEach(callback => callback(value));
          taker();
        }
      });
    })();
  }
};
