import { chan, buffer } from '../index';
import { getId } from '../../utils';

const PubSub = function () {
  let channels = {};
  const createChannel = (topic, b) => {
    if (!channels[ topic ]) {
      channels[ topic ] = {
        ch: chan(getId('pubsub_' + topic), b || buffer.fixed()),
        subscribers: [],
        listen: false
      };
    } else {
      // topic already created
      // console.warn(`"${topic}" already created.`);
    }
  };
  const listen = topic => {
    if (channels[ topic ] && channels[ topic ].listen === false) {
      const bus = channels[ topic ];
      const ch = bus.ch;
      bus.listen = true;
      (function taker() {
        ch.take(value => {
          if (value !== chan.CLOSED && value !== chan.ENDED) {
            bus.subscribers = bus.subscribers.filter(({ callback, once }) => {
              callback(value);
              return !once;
            });
            taker();
          }
        });
      })();
    }
  };

  const api = {
    subscribe(topic, callback, once = false) {
      createChannel(topic);
      channels[ topic ].subscribers.push({ callback, once });
      listen(topic);
    },
    publish(topic, payload, callback) {
      createChannel(topic);
      channels[ topic ].ch.put(payload, callback);
    },
    unsubscribe(topic, callback) {
      if (channels[ topic ]) {
        channels[ topic ].subscribers = channels[ topic ].subscribers.filter(({ callback: c }) => c !== callback);
      }
    },
    haltAll() {
      Object.keys(channels).forEach(topic => channels[ topic ].ch.close());
      channels = {};
    },
    halt(topic) {
      if (channels[ topic ]) {
        channels[ topic ].ch.close();
        delete channels[ topic ];
      }
    },
    getChannels() {
      return channels;
    },
    topic: createChannel
  };

  return api;
};
const ps = PubSub();

export const sub = ps.subscribe;
export const pub = ps.publish;
export const unsub = ps.unsubscribe;
export const unsubAll = ps.unsubscribeAll;
export const haltAll = ps.haltAll;
export const halt = ps.halt;
export const topicChannels = ps.getChannels;
export const topic = ps.topic;
