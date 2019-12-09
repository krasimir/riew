import { chan } from '../channel';

const PubSub = function () {
  let channels = {};
  const createChannel = topic => {
    if (!channels[ topic ]) {
      const ch = chan();
      const bus = (channels[ topic ] = {
        ch,
        subscribers: []
      });
      (function taker() {
        ch.take(value => {
          if (value !== chan.CLOSED && value !== chan.ENDED) {
            bus.subscribers.forEach(s => s(value));
            taker();
          }
        });
      })();
    }
  };

  const api = {
    subscribe(topic, callback) {
      createChannel(topic);
      channels[ topic ].subscribers.push(callback);
    },
    publish(topic, payload, callback) {
      createChannel(topic);
      channels[ topic ].ch.put(payload, callback);
    },
    unsubscribe(topic, callback) {
      if (channels[ topic ]) {
        channels[ topic ].subscribers = channels[ topic ].subscribers.filter(c => c !== callback);
      }
    },
    unsubscribeAll(topic) {
      if (channels[ topic ]) {
        channels[ topic ].subscribers = [];
      }
    },
    reset() {
      channels = {};
    },
    deleteTopic(topic) {
      if (channels[ topic ]) {
        channels[ topic ].ch.close();
        delete channels[ topic ];
      }
    }
  };

  return api;
};
const ps = PubSub();

export const sub = ps.subscribe;
export const pub = ps.publish;
export const unsub = ps.unsubscribe;
export const unsubAll = ps.unsubscribeAll;
export const pubsubReset = ps.reset;
export const deleteTopic = ps.deleteTopic;
